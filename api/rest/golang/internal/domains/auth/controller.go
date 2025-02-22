package auth

import (
	"net/http"
	"version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/renderer"
)

type controller struct {
	c *renderer.Renderer
}

func newController() *controller {
	return &controller{
		c: &renderer.Renderer{},
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
