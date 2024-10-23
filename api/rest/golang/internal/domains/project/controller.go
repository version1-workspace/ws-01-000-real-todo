package project

import (
	"fmt"
	"net/http"
	tkcontroller "version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/controller"

	"github.com/gorilla/mux"
)

type controller struct {
	c *tkcontroller.Controller
}

func newController() *controller {
	return &controller{
		c: &tkcontroller.Controller{},
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
	c.c.Render(w, map[string]string{"message": "ok"})
}
