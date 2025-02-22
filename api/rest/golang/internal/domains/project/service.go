package project

import (
	"context"
	"version1-workspace/ws-01-000-real-todo/internal/ent"
)

func newService(r *repository) *service {
	return &service{r: r}
}

type service struct {
	r *repository
}

func (s service) fetchProjects(ctx context.Context, limit, page, userID int, status []string) (Projects, error) {
	list, err := s.r.fetchProjects(ctx, userID, limit, page, status)
	if err != nil {
		return list, err
	}

	return list, err
}

func (s service) createProject(ctx context.Context, uid int, p *createProjectParams) (*Project, error) {
	prj := &Project{
		Project: &ent.Project{
			Name:     p.Name,
			Deadline: p.Deadline,
			Status:   "active",
			Slug:     p.Slug,
			Goal:     p.Goal,
			Shouldbe: p.Shouldbe,
		},
	}
	milestones := []*ent.Task{}
	for _, m := range p.Milestones {
		milestones = append(milestones, &ent.Task{
			Kind:     "milestone",
			Status:   "scheduled",
			Title:    m.Title,
			Deadline: m.Deadline,
		})
	}
	prj.Project.Edges.Milestones = milestones

	list, err := s.r.createProject(ctx, uid, prj)
	if err != nil {
		return list, err
	}

	return &Project{}, nil
}
