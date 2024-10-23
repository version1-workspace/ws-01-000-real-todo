package user

import (
	"fmt"
	"net/http"
	"version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/module"

	"github.com/gorilla/mux"
)

var _ module.Moduler = (*UserModule)(nil)

func New(r *mux.Router) *UserModule {
	c := newController()
	return &UserModule{
		basePath: "/users",
		handlers: []module.HandleFunc{
			{Methods: []string{http.MethodGet}, Path: "/me", Handler: c.me},
		},
		r: r,
		c: c,
	}
}

type UserModule struct {
	basePath string
	modules  []module.Moduler
	handlers []module.HandleFunc
	r        *mux.Router
	c        *controller
}

func (m *UserModule) AddSub(mod module.Moduler) {
	m.modules = append(m.modules, mod)
}

func (m UserModule) Register(prefix string) {
	_prefix := fmt.Sprintf("%s/%s", prefix, m.basePath)
	module.RegisterHandlers(m.r, m.handlers, _prefix)
	for _, mm := range m.modules {
		mm.Register(_prefix)
	}
}
