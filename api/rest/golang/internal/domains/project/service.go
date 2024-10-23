package project

import "context"

type service struct {
	r *repository
}

func (s service) fetchProjects(ctx context.Context, limit, page int, status []string) ([]Project, error) {
	list, err := s.r.fetchProjects(ctx, limit, page, status)
	if err != nil {
		return list, err
	}

	return list, err
}
