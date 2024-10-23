package api

import (
	"fmt"
	"net/http"
	"path/filepath"
	"version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/module"

	"github.com/gorilla/mux"
)

type Module struct {
	basePath string
	modules  []module.Moduler
	r        *mux.Router
}

func New(r *mux.Router) *Module {
	return &Module{
		basePath: "/api/v1",
		r:        r,
	}
}

func (m Module) Register(_ string) {
	for _, mm := range m.modules {
		mm.Register("")
	}
}

func (m *Module) AddSub(mod module.Moduler) {
	m.modules = append(m.modules, mod)
}

func (m Module) Handle(methods []string, path string, handler func(http.ResponseWriter, *http.Request)) {
	pattern := filepath.Clean(fmt.Sprintf("%s/%s", m.basePath, path))
	m.r.HandleFunc(pattern, handler).Methods(methods...)
}
