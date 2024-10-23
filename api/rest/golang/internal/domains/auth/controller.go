package auth

import (
	"net/http"
	tkcontroller "version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/controller"
)

type controller struct {
	c *tkcontroller.Controller
}

func newController() *controller {
	return &controller{
		c: &tkcontroller.Controller{},
	}
}

func (c controller) login(w http.ResponseWriter, r *http.Request) {
	c.c.Render(w, map[string]string{"message": "ok"})
}

func (c controller) logout(w http.ResponseWriter, r *http.Request) {
	c.c.Render(w, map[string]string{"message": "ok"})
}

func (c controller) refreshToken(w http.ResponseWriter, r *http.Request) {
	c.c.Render(w, map[string]string{"message": "ok"})
}
