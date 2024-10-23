package user

import (
	"net/http"
	"version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/module"

	"github.com/gorilla/mux"
)

var _ module.Moduler = (*UserModule)(nil)

func New(r *mux.Router) *UserModule {
	c := newController()
	return &UserModule{
		module.Module{
			BasePath: "/users",
			Handlers: []module.HandleFunc{
				{Methods: []string{http.MethodGet}, Path: "/me", Handler: c.me},
			},
			Router: r,
		},
	}
}

type UserModule struct {
	module.Module
}
