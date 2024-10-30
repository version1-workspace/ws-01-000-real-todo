package db

import (
	"database/sql"
	"log"

	"github.com/go-sql-driver/mysql"
)

type config mysql.Config

func NewConfig() *config {
	return &config{
		User:   "root",
		Passwd: "password",
		Net:    "tcp",
		Addr:   "127.0.0.1:3306",
		DBName: "todo_golang_development",
	}
}

func (c *config) MustOpen() *sql.DB {
	connstr := ((*mysql.Config)(c)).FormatDSN()

	db, err := sql.Open("mysql", connstr)
	if err != nil {
		log.Fatalf("failed opening db connection: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("ping failed: %v", err)
	}

	return db
}
