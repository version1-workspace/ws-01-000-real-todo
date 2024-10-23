package module

import (
	"net/http"
	"reflect"
	"testing"

	"github.com/gorilla/mux"
)

func testRouteMapping(t *testing.T, m map[string]bool, r *mux.Router) {
	err := r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		path, err := route.GetPathTemplate()
		if err != nil {
			return err
		}

		methods, err := route.GetMethods()
		if err != nil {
			return err
		}
		for _, method := range methods {
			if _, ok := m[method+" "+path]; ok {
				m[method+" "+path] = true
			}
		}

		return nil
	})
	if err != nil {
		t.Fatal(err)
	}

	for k, v := range m {
		if !v {
			t.Errorf("Route %s not found", k)
		}
	}
}

// Test RegisterHandlers Function
func TestRegisterHandlers(t *testing.T) {
	testHandler := func(w http.ResponseWriter, r *http.Request) {}
	handlers := []HandleFunc{
		{
			Methods: []string{"GET"},
			Path:    "test",
			Group:   "group1",
			Handler: testHandler,
		},
		{
			Methods: []string{"GET", "POST", "PATCH", "DELETE"},
			Path:    "test/:id",
			Group:   "group1",
			Handler: testHandler,
		},
		{
			Methods: []string{"POST"},
			Path:    "example",
			Group:   "group2",
			Handler: testHandler,
		},
	}

	r := mux.NewRouter()
	RegisterHandlers(r, handlers, "/api/v1")

	tester := map[string]bool{
		"GET /api/v1/test":        false,
		"GET /api/v1/test/:id":    false,
		"POST /api/v1/test/:id":   false,
		"PATCH /api/v1/test/:id":  false,
		"DELETE /api/v1/test/:id": false,
		"POST /api/v1/example":    false,
	}
	testRouteMapping(t, tester, r)
}

func TestModule__Register(t *testing.T) {
	r := mux.NewRouter()
	root := &Module{
		BasePath: "/root",
		Router:   r,
		Handlers: []HandleFunc{
			{
				Methods: []string{"GET"},
				Path:    "/test",
			},
		},
	}

	sub1 := &Module{
		BasePath: "/sub1",
		Router:   r,
		Handlers: []HandleFunc{
			{
				Methods: []string{"GET"},
				Path:    "/test",
			},
			{
				Methods: []string{"PUT"},
				Path:    "/test",
			},
			{
				Methods: []string{"POST"},
				Path:    "/test",
			},
			{
				Methods: []string{"PATCH"},
				Path:    "/test",
			},
			{
				Methods: []string{"DELETE"},
				Path:    "/test",
			},
			{
				Methods: []string{"GET"},
				Path:    "/test/:id",
			},
		},
	}

	sub2 := &Module{
		BasePath: "/sub2",
		Router:   r,
		Handlers: []HandleFunc{
			{
				Methods: []string{"GET"},
				Path:    "/test",
			},
		},
	}

	root.AddSub(sub1)
	root.AddSub(sub2)
	root.Register("/api/v1")
	tester := map[string]bool{
		"GET /api/v1/root/test":          false,
		"GET /api/v1/root/sub1/test":     false,
		"POST /api/v1/root/sub1/test":    false,
		"PATCH /api/v1/root/sub1/test":   false,
		"PUT /api/v1/root/sub1/test":     false,
		"DELETE /api/v1/root/sub1/test":  false,
		"GET /api/v1/root/sub1/test/:id": false,
		"GET /api/v1/root/sub2/test":     false,
	}
	testRouteMapping(t, tester, r)
}

func TestModule__Filter(t *testing.T) {
	tables := []struct {
		name    string
		subject func(t *testing.T) *Module
		assert  func(t *testing.T, m *Module)
	}{
		{
			name: "Filter",
			subject: func(t *testing.T) *Module {
				r := mux.NewRouter()
				return &Module{
					BasePath: "/root",
					Router:   r,
					Handlers: []HandleFunc{
						{
							Methods: []string{"GET"},
							Path:    "/a/test",
							Group:   "group1",
						},
						{
							Methods: []string{"GET"},
							Path:    "/a/test/:id",
							Group:   "group1",
						},
						{
							Methods: []string{"GET"},
							Path:    "/b/test",
							Group:   "group2",
						},
						{
							Methods: []string{"GET"},
							Path:    "/b/test/:id",
							Group:   "group2",
						},
					},
				}
			},
			assert: func(t *testing.T, m *Module) {
				res := m.Filter("group1")
				if len(res.Handlers) != 2 {
					t.Errorf("Expected 2, got %d", len(res.Handlers))
				}

				list := []string{}
				for _, h := range res.Handlers {
					if h.Group != "group1" {
						t.Errorf("Expected group1, got %s", h.Group)
					}
					list = append(list, h.Path)
				}

				expected := []string{"/a/test", "/a/test/:id"}
				if !reflect.DeepEqual(list, expected) {
					t.Errorf("Expected %v, got %v", expected, list)
				}
			},
		},
	}

	for _, table := range tables {
		t.Run(table.name, func(t *testing.T) {
			m := table.subject(t)
			table.assert(t, m)
		})
	}
}
