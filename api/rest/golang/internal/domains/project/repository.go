package project

import (
	"context"
	"version1-workspace/ws-01-000-real-todo/internal/ent"
	"version1-workspace/ws-01-000-real-todo/internal/ent/project"
	"version1-workspace/ws-01-000-real-todo/internal/pkg/serializer"
	"version1-workspace/ws-01-000-real-todo/internal/pkg/toolkit/renderer"
)

type Project struct {
	*ent.Project
}

type Projects []Project

var _ renderer.ArraySerializer = (*Projects)(nil)
var _ renderer.Serializer = (*Project)(nil)

func (p Projects) Serialize() ([]map[string]any, error) {
	return serializer.SerialzieCollection(p)
}

func (p Project) Serialize() (map[string]any, error) {
	return serializer.Serialize(p.Project, project.Columns)
}

func newRepository(cli client) *repository {
	return &repository{
		client: cli,
	}
}

type repository struct {
	client client
}

func (r repository) fetchProjects(ctx context.Context, userID int, limit, page int, status []string) (Projects, error) {
	list, err := r.client.Get().Project.Query().Where(project.UserID(userID)).All(ctx)
	if err != nil {
		return Projects{}, err
	}

	projects := []Project{}
	for _, p := range list {
		if p != nil {
			projects = append(projects, Project{p})
		}
	}

	return Projects(projects), nil
}
