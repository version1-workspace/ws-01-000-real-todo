package project

import (
	"context"
	"fmt"
)

func newService(r *repository) *service {
	return &service{r: r}
}

type service struct {
	r *repository
}

func (s service) fetchProjects(ctx context.Context, limit, page int, status []string) ([]Project, error) {
	const userID = 1
	list, err := s.r.fetchProjects(ctx, userID, limit, page, status)
	if err != nil {
		fmt.Println("Error: ", err)
		return list, err
	}

	return list, err
}
