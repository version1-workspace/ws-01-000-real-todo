package project

import (
	"fmt"
	"net/http"
	appcontext "version1-workspace/ws-01-000-real-todo/internal/context"
	tkcontroller "version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/controller"

	"github.com/gorilla/mux"
)

type controller struct {
	c *tkcontroller.Controller
	s *service
}

func newController(s *service) *controller {
	return &controller{
		c: &tkcontroller.Controller{},
		s: s,
	}
}

func (c controller) milestones(w http.ResponseWriter, r *http.Request) {
	v := mux.Vars(r)
	slug := v["slug"]
	message := fmt.Sprintf("Milestones for project %s", slug)
	c.c.Render(w, map[string]string{"message": message})
}

func (c controller) archiveMilestones(w http.ResponseWriter, r *http.Request) {
	c.c.Render(w, map[string]string{"message": "ok"})
}

func (c controller) projects(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	u, err := appcontext.CurrentUser(ctx)
	if err != nil {
		c.c.Unauthorized(w, err)
		return
	}

	list, err := c.s.fetchProjects(ctx, 10, 1, u.ID, []string{"active"})
	if err != nil {
		c.c.InternalServerError(w, err)
		return
	}

	payload := []map[string]any{}
	for _, p := range list {
		payload = append(payload, p.Serialize())
	}

	c.c.RenderMany(w, payload, &tkcontroller.PageInfo{Limit: 10, Page: 1})
}
