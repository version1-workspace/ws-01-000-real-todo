package project

import (
	"context"
	"version1-workspace/ws-01-000-real-todo/internal/ent"
	"version1-workspace/ws-01-000-real-todo/internal/ent/project"
)

type Project struct {
	*ent.Project
}

func newRepository(cli client) *repository {
	return &repository{
		client: cli,
	}
}

type repository struct {
	client client
}

func (r repository) fetchProjects(ctx context.Context, userID int, limit, page int, status []string) ([]Project, error) {
	list, err := r.client.Get().Project.Query().Where(project.UserID(userID)).All(ctx)
	if err != nil {
		return []Project{}, err
	}

	projects := []Project{}
	for _, p := range list {
		if p != nil {
			projects = append(projects, Project{p})
		}
	}

	return []Project{}, nil
}
