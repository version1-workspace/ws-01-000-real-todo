package project

import (
	"context"
	"net/http"
	"version1-workspace/ws-01-000-real-todo/internal/ent"
	"version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/module"

	"github.com/gorilla/mux"
)

type client interface {
	Get() *ent.Client
	WithTx(ctx context.Context, fn func(tx *ent.Tx) error) error
}

var _ module.Moduler = (*Module)(nil)

func New(cli client, r *mux.Router) *Module {
	repo := newRepository(cli)
	srv := newService(repo)
	c := newController(srv)

	return &Module{
		Module: module.Module{
			BasePath: "/projects",
			Handlers: []module.HandleFunc{
				{Methods: []string{http.MethodGet}, Path: "/{slug}/milestones", Handler: c.milestones, Group: "root"},
				{Methods: []string{http.MethodPut}, Path: "/{slug}/milestones/{id}/archive", Handler: c.archiveMilestones, Group: "root"},
				{Methods: []string{http.MethodGet}, Path: "/", Handler: c.projects, Group: "users"},
				{Methods: []string{http.MethodPost}, Path: "/", Handler: c.create, Group: "users"},
				{Methods: []string{http.MethodPatch}, Path: "/{slug}/archive/", Handler: c.projects, Group: "users"},
				{Methods: []string{http.MethodPatch}, Path: "/{slug}/reopen/", Handler: c.projects, Group: "users"},
			},
			Router: r,
		},
	}
}

type Module struct {
	module.Module
}
