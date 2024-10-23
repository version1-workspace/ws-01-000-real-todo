package project

import (
	"net/http"
	"version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/module"

	"github.com/gorilla/mux"
)

var _ module.Moduler = (*Module)(nil)

func New(r *mux.Router) *Module {
	c := newController()
	return &Module{
		Module: module.Module{
			BasePath: "/projects",
			Handlers: []module.HandleFunc{
				{Methods: []string{http.MethodGet}, Path: "/{slug}/milestones", Handler: c.milestones, Group: "root"},
				{Methods: []string{http.MethodPut}, Path: "/{slug}/milestones/{id}/archive", Handler: c.archiveMilestones, Group: "root"},
				{Methods: []string{http.MethodGet}, Path: "/", Handler: c.projects, Group: "users"},
				{Methods: []string{http.MethodPatch}, Path: "/{slug}/archive/", Handler: c.projects, Group: "users"},
				{Methods: []string{http.MethodPatch}, Path: "/{slug}/reopen/", Handler: c.projects, Group: "users"},
			},
			Router: r,
		},
	}
}

type Module struct {
	module.Module
}
