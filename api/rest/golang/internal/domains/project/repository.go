package project

import (
	"context"
	"database/sql"
)

type Project struct {
	// not implemented yet
}

type repository struct {
	db *sql.DB
}

func (r repository) fetchProjects(ctx context.Context, limit, page int, status []string) ([]Project, error) {
	// not implemented yet
	return []Project{}, nil
}
