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
		basePath: "/projects",
		handlers: []module.HandleFunc{
			{Methods: []string{http.MethodGet}, Path: "/{slug}/milestones", Handler: c.milestones, Group: "root"},
			{Methods: []string{http.MethodPut}, Path: "/{slug}/milestones/{id}/archive", Handler: c.archiveMilestones, Group: "root"},
			{Methods: []string{http.MethodGet}, Path: "/", Handler: c.projects, Group: "users"},
			{Methods: []string{http.MethodPatch}, Path: "/{slug}/archive/", Handler: c.projects, Group: "users"},
			{Methods: []string{http.MethodPatch}, Path: "/{slug}/reopen/", Handler: c.projects, Group: "users"},
		},
		r: r,
		c: newController(),
	}
}

type Module struct {
	basePath string
	handlers []module.HandleFunc
	r        *mux.Router
	c        *controller
}

func (m Module) Filter(g string) *Module {
	list := []module.HandleFunc{}
	for _, l := range m.handlers {
		if l.Group == g {
			list = append(list, l)
		}
	}
	m.handlers = list
	return &m
}

func (m Module) Register(prefix string) {
	_prefix := prefix + m.basePath
	module.RegisterHandlers(m.r, m.handlers, _prefix)
}

func (m Module) AddSub(mod module.Moduler) {
}
