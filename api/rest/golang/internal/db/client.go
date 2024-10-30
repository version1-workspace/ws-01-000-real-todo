package db

import (
	"database/sql"
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
	entclient := ent.NewClient(ent.Driver(drv))
	ql := logger.NewQueryLogger(true)
	entclient.WithCustomLogger(ql.PrintWithColor)

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
