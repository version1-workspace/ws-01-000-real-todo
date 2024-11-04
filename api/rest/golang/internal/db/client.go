package db

import (
	"context"
	"database/sql"
	"fmt"
	"version1-workspace/ws-01-000-real-todo/internal/ent"
	"version1-workspace/ws-01-000-real-todo/internal/logger"

	entsql "entgo.io/ent/dialect/sql"
)

type Client struct {
	*ent.Client
	queryLog bool
}

func NewClient(db *sql.DB, queryLog bool) *Client {
	drv := entsql.OpenDB("mysql", db)
	ql := logger.NewQueryLogger(true)
	entclient := ent.NewClient(ent.Driver(drv), ent.Log(ql.PrintWithColor))

	return &Client{
		Client:   entclient,
		queryLog: queryLog,
	}
}

func (c *Client) Close() error {
	return c.Client.Close()
}

func (c *Client) Get() *ent.Client {
	if c.queryLog {
		return c.Client.Debug()
	}

	return c.Client
}

func WithTx(ctx context.Context, client *ent.Client, fn func(tx *ent.Tx) error) error {
	tx, err := client.Tx(ctx)
	if err != nil {
		return err
	}
	defer func() {
		if v := recover(); v != nil {
			tx.Rollback()
			panic(v)
		}
	}()
	if err := fn(tx); err != nil {
		if rerr := tx.Rollback(); rerr != nil {
			err = fmt.Errorf("%w: rolling back transaction: %v", err, rerr)
		}
		return err
	}
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("committing transaction: %w", err)
	}
	return nil
}
