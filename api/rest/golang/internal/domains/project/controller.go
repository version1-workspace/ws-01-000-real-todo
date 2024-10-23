package project

import (
	"fmt"
	"net/http"
	tkcontroller "version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/controller"

	"github.com/gorilla/mux"
)

type controller struct {
	c *tkcontroller.Controller
	s *service
}

func newController() *controller {
	return &controller{
		c: &tkcontroller.Controller{},
		s: &service{},
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
	list, err := c.s.fetchProjects(ctx, 10, 1, []string{"active"})
	if err != nil {
		c.c.InternalServerError(w, err)
		return
	}

	c.c.Render(w, list)
}
