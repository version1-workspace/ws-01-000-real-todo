package project

import (
	"fmt"
	"net/http"
	appcontext "version1-workspace/ws-01-000-real-todo/internal/context"
	 "version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/renderer"

	"github.com/gorilla/mux"
)

type controller struct {
	r *renderer.Renderer
	s *service
}

func newController(s *service) *controller {
	return &controller{
		r: &renderer.Renderer{},
		s: s,
	}
}

func (c controller) milestones(w http.ResponseWriter, r *http.Request) {
	v := mux.Vars(r)
	slug := v["slug"]
	message := fmt.Sprintf("Milestones for project %s", slug)
	c.r.Render(w, map[string]string{"message": message})
}

func (c controller) archiveMilestones(w http.ResponseWriter, r *http.Request) {
	c.r.Render(w, map[string]string{"message": "ok"})
}

func (c controller) projects(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	u, err := appcontext.CurrentUser(ctx)
	if err != nil {
		c.r.Unauthorized(w, err)
		return
	}

	projects, err := c.s.fetchProjects(ctx, 10, 1, u.ID, []string{"active"})
	if err != nil {
		c.r.InternalServerError(w, err)
		return
	}

	c.r.RenderMany(w, projects, &renderer.PageInfo{Limit: 10, Page: 1})
}
