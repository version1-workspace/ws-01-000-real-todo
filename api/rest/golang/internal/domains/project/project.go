package project

import (
	"net/http"
	"regexp"
	"version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/module"

	"github.com/gorilla/mux"
)

var _ module.Moduler = (*Module)(nil)

func New(r *mux.Router) *Module {
	c := newController()
	return &Module{
		basePath: "/projects",
		handlers: []module.HandleFunc{
			{Methods: []string{http.MethodGet}, Path: "/{slug}/milestones", Handler: c.milestones},
			{Methods: []string{http.MethodPut}, Path: "/{slug}/milestones/{id}/archive", Handler: c.archiveMilestones},
			{Methods: []string{http.MethodGet}, Path: "/", Handler: c.projects},
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

func (m Module) Filter(r string) *Module {
	list := []module.HandleFunc{}
	re := regexp.MustCompile(r)
	for _, l := range m.handlers {
		if re.MatchString(l.Path) {
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
