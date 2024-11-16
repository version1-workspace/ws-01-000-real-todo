package project

import (
	"fmt"
	"net/http"
	"time"
	appcontext "version1-workspace/ws-01-000-real-todo/internal/context"
	"version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/bodyparser"
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

type taskParams struct {
	Title    string    `json:"title"`
	Deadline time.Time `json:"deadline"`
}

// FIXME: Milestone is not saved for now
type createProjectParams struct {
	Name       string       `json:"name"`
	Deadline   time.Time    `json:"deadline"`
	Status     string       `json:"status"`
	Slug       string       `json:"slug"`
	Goal       string       `json:"goal"`
	Shouldbe   string       `json:"shouldbe"`
	Milestones []taskParams `json:"milestone"`
}

func (c controller) create(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	u, err := appcontext.CurrentUser(ctx)
	if err != nil {
		c.r.Unauthorized(w, err)
		return
	}

	p := &createProjectParams{}
	if err := bodyparser.Parse(r, &p); err != nil {
		c.r.BadRequest(w, err)
		return
	}

	if _, err := c.s.createProject(ctx, u.ID, p); err != nil {
		c.r.InternalServerError(w, err)
		return
	}

	c.r.Created(w, nil)
}
