// Code generated by ent, DO NOT EDIT.

package project

import (
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"github.com/google/uuid"
)

const (
	// Label holds the string label denoting the project type in the database.
	Label = "project"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldUUID holds the string denoting the uuid field in the database.
	FieldUUID = "uuid"
	// FieldSlug holds the string denoting the slug field in the database.
	FieldSlug = "slug"
	// FieldName holds the string denoting the name field in the database.
	FieldName = "name"
	// FieldUserID holds the string denoting the user_id field in the database.
	FieldUserID = "user_id"
	// FieldGoal holds the string denoting the goal field in the database.
	FieldGoal = "goal"
	// FieldShouldbe holds the string denoting the shouldbe field in the database.
	FieldShouldbe = "shouldbe"
	// FieldStatus holds the string denoting the status field in the database.
	FieldStatus = "status"
	// FieldDeadline holds the string denoting the deadline field in the database.
	FieldDeadline = "deadline"
	// FieldStartingAt holds the string denoting the starting_at field in the database.
	FieldStartingAt = "starting_at"
	// FieldStartedAt holds the string denoting the started_at field in the database.
	FieldStartedAt = "started_at"
	// FieldFinishedAt holds the string denoting the finished_at field in the database.
	FieldFinishedAt = "finished_at"
	// FieldArchivedAt holds the string denoting the archived_at field in the database.
	FieldArchivedAt = "archived_at"
	// FieldCreatedAt holds the string denoting the created_at field in the database.
	FieldCreatedAt = "created_at"
	// FieldUpdatedAt holds the string denoting the updated_at field in the database.
	FieldUpdatedAt = "updated_at"
	// EdgeUsers holds the string denoting the users edge name in mutations.
	EdgeUsers = "users"
	// Table holds the table name of the project in the database.
	Table = "projects"
	// UsersTable is the table that holds the users relation/edge.
	UsersTable = "projects"
	// UsersInverseTable is the table name for the User entity.
	// It exists in this package in order to avoid circular dependency with the "user" package.
	UsersInverseTable = "users"
	// UsersColumn is the table column denoting the users relation/edge.
	UsersColumn = "user_projects"
)

// Columns holds all SQL columns for project fields.
var Columns = []string{
	FieldID,
	FieldUUID,
	FieldSlug,
	FieldName,
	FieldUserID,
	FieldGoal,
	FieldShouldbe,
	FieldStatus,
	FieldDeadline,
	FieldStartingAt,
	FieldStartedAt,
	FieldFinishedAt,
	FieldArchivedAt,
	FieldCreatedAt,
	FieldUpdatedAt,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "projects"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"user_projects",
}

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	for i := range ForeignKeys {
		if column == ForeignKeys[i] {
			return true
		}
	}
	return false
}

var (
	// DefaultUUID holds the default value on creation for the "uuid" field.
	DefaultUUID func() uuid.UUID
	// SlugValidator is a validator for the "slug" field. It is called by the builders before save.
	SlugValidator func(string) error
	// NameValidator is a validator for the "name" field. It is called by the builders before save.
	NameValidator func(string) error
	// UserIDValidator is a validator for the "user_id" field. It is called by the builders before save.
	UserIDValidator func(int) error
	// GoalValidator is a validator for the "goal" field. It is called by the builders before save.
	GoalValidator func(string) error
	// DefaultCreatedAt holds the default value on creation for the "created_at" field.
	DefaultCreatedAt func() time.Time
	// DefaultUpdatedAt holds the default value on creation for the "updated_at" field.
	DefaultUpdatedAt func() time.Time
)

// Status defines the type for the "status" enum field.
type Status string

// StatusInitial is the default value of the Status enum.
const DefaultStatus = StatusInitial

// Status values.
const (
	StatusInitial  Status = "initial"
	StatusActive   Status = "active"
	StatusArchived Status = "archived"
)

func (s Status) String() string {
	return string(s)
}

// StatusValidator is a validator for the "status" field enum values. It is called by the builders before save.
func StatusValidator(s Status) error {
	switch s {
	case StatusInitial, StatusActive, StatusArchived:
		return nil
	default:
		return fmt.Errorf("project: invalid enum value for status field: %q", s)
	}
}

// OrderOption defines the ordering options for the Project queries.
type OrderOption func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// ByUUID orders the results by the uuid field.
func ByUUID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldUUID, opts...).ToFunc()
}

// BySlug orders the results by the slug field.
func BySlug(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldSlug, opts...).ToFunc()
}

// ByName orders the results by the name field.
func ByName(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldName, opts...).ToFunc()
}

// ByUserID orders the results by the user_id field.
func ByUserID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldUserID, opts...).ToFunc()
}

// ByGoal orders the results by the goal field.
func ByGoal(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldGoal, opts...).ToFunc()
}

// ByShouldbe orders the results by the shouldbe field.
func ByShouldbe(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldShouldbe, opts...).ToFunc()
}

// ByStatus orders the results by the status field.
func ByStatus(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldStatus, opts...).ToFunc()
}

// ByDeadline orders the results by the deadline field.
func ByDeadline(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldDeadline, opts...).ToFunc()
}

// ByStartingAt orders the results by the starting_at field.
func ByStartingAt(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldStartingAt, opts...).ToFunc()
}

// ByStartedAt orders the results by the started_at field.
func ByStartedAt(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldStartedAt, opts...).ToFunc()
}

// ByFinishedAt orders the results by the finished_at field.
func ByFinishedAt(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldFinishedAt, opts...).ToFunc()
}

// ByArchivedAt orders the results by the archived_at field.
func ByArchivedAt(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldArchivedAt, opts...).ToFunc()
}

// ByCreatedAt orders the results by the created_at field.
func ByCreatedAt(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldCreatedAt, opts...).ToFunc()
}

// ByUpdatedAt orders the results by the updated_at field.
func ByUpdatedAt(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldUpdatedAt, opts...).ToFunc()
}

// ByUsersField orders the results by users field.
func ByUsersField(field string, opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newUsersStep(), sql.OrderByField(field, opts...))
	}
}
func newUsersStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(UsersInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, UsersTable, UsersColumn),
	)
}
