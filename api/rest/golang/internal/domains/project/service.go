package project

import (
	"context"
)

func newService(r *repository) *service {
	return &service{r: r}
}

type service struct {
	r *repository
}

func (s service) fetchProjects(ctx context.Context, limit, page, userID int, status []string) ([]Project, error) {
	list, err := s.r.fetchProjects(ctx, userID, limit, page, status)
	if err != nil {
		return list, err
	}

	return list, err
}
