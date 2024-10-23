package auth

import (
	"net/http"
	"version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/module"

	"github.com/gorilla/mux"
)

var _ module.Moduler = (*Module)(nil)

func New(r *mux.Router) *Module {
	c := newController()
	return &Module{
		basePath: "/auth",
		handlers: []module.HandleFunc{
			{Methods: []string{http.MethodPost}, Path: "/login", Handler: c.login},
			{Methods: []string{http.MethodPost}, Path: "/refresh", Handler: c.refreshToken},
			{Methods: []string{http.MethodDelete}, Path: "/refresh", Handler: c.logout},
		},
		r: r,
	}
}

type Module struct {
	basePath string
	handlers []module.HandleFunc
	r        *mux.Router
	c        *controller
}

func (m Module) Register(prefix string) {
	_prefix := prefix + m.basePath
	module.RegisterHandlers(m.r, m.handlers, _prefix)
}

func (m Module) AddSub(mod module.Moduler) {
}
