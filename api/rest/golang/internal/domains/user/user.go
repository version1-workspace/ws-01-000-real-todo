package user

import (
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"
)

func New(r *mux.Router) *UserModule {
	return &UserModule{
		basePath: "/api/v1/users",
		r:        r,
		c:        newController(),
	}
}

type UserModule struct {
	basePath string
	r        *mux.Router
	c        *controller
}

func (m UserModule) Register() {
	m.Handle([]string{http.MethodGet}, "/me", m.c.me)
}

func (m UserModule) Handle(methods []string, path string, handler func(http.ResponseWriter, *http.Request)) {
	pattern := filepath.Clean(fmt.Sprintf("%s/%s", m.basePath, path))
	m.r.HandleFunc(pattern, handler).Methods(methods...)
}
