package project

import (
	"context"
	"version1-workspace/ws-01-000-real-todo/internal/ent"
	"version1-workspace/ws-01-000-real-todo/internal/ent/project"
)

type Project struct {
	*ent.Project
}

func (p Project) Serialize() map[string]interface{} {
	return map[string]interface{}{
		"id":         p.ID,
		"name":       p.Name,
		"userId":     p.UserID,
		"status":     p.Status,
		"goal":       p.Goal,
		"shouldbe":   p.Shouldbe,
		"deadline":   p.Deadline,
		"startingAt": p.StartedAt,
		"startedAt":  p.StartedAt,
		"finishedAt": p.FinishedAt,
		"createdAt":  p.CreatedAt,
		"updatedAt":  p.UpdatedAt,
	}
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

	return projects, nil
}
