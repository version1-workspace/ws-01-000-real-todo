package context

import (
	"context"
	"fmt"
	"version1-workspace/ws-01-000-real-todo/internal/ent"
)

func CurrentUser(ctx context.Context) (*ent.User, error) {
	v := ctx.Value("user")
	if v == nil {
		return nil, fmt.Errorf("user not found")
	}

	u, ok := v.(*ent.User)
	if !ok {
		return nil, fmt.Errorf("user is unexpected type. expected *ent.User got %T", v)
	}

	return u, nil
}
