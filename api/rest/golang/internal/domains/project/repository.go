package project

import (
	"context"
	"version1-workspace/ws-01-000-real-todo/internal/ent"
	"version1-workspace/ws-01-000-real-todo/internal/ent/project"
	"version1-workspace/ws-01-000-real-todo/internal/ent/user"
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
	u := r.client.Get().User.Query().Where(user.ID(userID)).OnlyX(ctx)
	list, err := u.QueryProjects().All(ctx)
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

func (r repository) createProject(ctx context.Context, userID int, prj *Project) (*Project, error) {
	res := &Project{}
	err := r.client.WithTx(ctx, func(tx *ent.Tx) error {
		p, err := tx.Project.Create().
			SetUserID(userID).
			SetName(prj.Name).
			SetDeadline(prj.Deadline).
			SetStatus(prj.Status).
			SetSlug(prj.Slug).
			SetGoal(prj.Goal).
			SetShouldbe(prj.Shouldbe).Save(ctx)
		if err != nil {
			return err
		}

		tasks := []*ent.Task{}
		for _, m := range prj.Edges.Milestones {
			task, err := tx.Task.Create().
				SetKind("milestone").
				SetDeadline(m.Deadline).
				SetTitle(m.Title).
				SetStatus(m.Status).
				SetProject(p).
				SetUserID(userID).
				SetMilestoneParent(p).
				Save(ctx)
			if err != nil {
				return err
			}
			tasks = append(tasks, task)
		}

		res.Project = p
		return nil
	})

	return res, err
}
