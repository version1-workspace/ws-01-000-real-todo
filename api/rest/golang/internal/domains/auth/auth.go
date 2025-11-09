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
		Module: module.Module{
			BasePath: "/auth",
			Handlers: []module.HandleFunc{
				{Methods: []string{http.MethodPost}, Path: "/login", Handler: c.login},
				{Methods: []string{http.MethodPost}, Path: "/refresh", Handler: c.refreshToken},
				{Methods: []string{http.MethodDelete}, Path: "/refresh", Handler: c.logout},
			},
			Router: r,
		},
	}
}

type Module struct {
	module.Module
}
