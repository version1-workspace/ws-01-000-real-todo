package user

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

func (c controller) me(w http.ResponseWriter, r *http.Request) {
	c.c.Render(w, map[string]string{"message": "ok"})
}
