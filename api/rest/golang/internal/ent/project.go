// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"strings"
	"time"
	"version1-workspace/ws-01-000-real-todo/internal/ent/project"
	"version1-workspace/ws-01-000-real-todo/internal/ent/user"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"github.com/google/uuid"
)

// Project is the model entity for the Project schema.
type Project struct {
	config `json:"-"`
	// ID of the ent.
	ID int `json:"id,omitempty"`
	// UUID holds the value of the "uuid" field.
	UUID uuid.UUID `json:"uuid,omitempty"`
	// Slug holds the value of the "slug" field.
	Slug string `json:"slug,omitempty"`
	// Name holds the value of the "name" field.
	Name string `json:"name,omitempty"`
	// UserID holds the value of the "user_id" field.
	UserID int `json:"user_id,omitempty"`
	// Goal holds the value of the "goal" field.
	Goal string `json:"goal,omitempty"`
	// Shouldbe holds the value of the "shouldbe" field.
	Shouldbe string `json:"shouldbe,omitempty"`
	// Status holds the value of the "status" field.
	Status project.Status `json:"status,omitempty"`
	// Deadline holds the value of the "deadline" field.
	Deadline time.Time `json:"deadline,omitempty"`
	// StartingAt holds the value of the "starting_at" field.
	StartingAt *time.Time `json:"starting_at,omitempty"`
	// StartedAt holds the value of the "started_at" field.
	StartedAt *time.Time `json:"started_at,omitempty"`
	// FinishedAt holds the value of the "finished_at" field.
	FinishedAt *time.Time `json:"finished_at,omitempty"`
	// ArchivedAt holds the value of the "archived_at" field.
	ArchivedAt *time.Time `json:"archived_at,omitempty"`
	// CreatedAt holds the value of the "created_at" field.
	CreatedAt time.Time `json:"created_at,omitempty"`
	// UpdatedAt holds the value of the "updated_at" field.
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the ProjectQuery when eager-loading is set.
	Edges         ProjectEdges `json:"edges"`
	user_projects *int
	selectValues  sql.SelectValues
}

// ProjectEdges holds the relations/edges for other nodes in the graph.
type ProjectEdges struct {
	// Users holds the value of the users edge.
	Users *User `json:"users,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [1]bool
}

// UsersOrErr returns the Users value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e ProjectEdges) UsersOrErr() (*User, error) {
	if e.Users != nil {
		return e.Users, nil
	} else if e.loadedTypes[0] {
		return nil, &NotFoundError{label: user.Label}
	}
	return nil, &NotLoadedError{edge: "users"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Project) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case project.FieldID, project.FieldUserID:
			values[i] = new(sql.NullInt64)
		case project.FieldSlug, project.FieldName, project.FieldGoal, project.FieldShouldbe, project.FieldStatus:
			values[i] = new(sql.NullString)
		case project.FieldDeadline, project.FieldStartingAt, project.FieldStartedAt, project.FieldFinishedAt, project.FieldArchivedAt, project.FieldCreatedAt, project.FieldUpdatedAt:
			values[i] = new(sql.NullTime)
		case project.FieldUUID:
			values[i] = new(uuid.UUID)
		case project.ForeignKeys[0]: // user_projects
			values[i] = new(sql.NullInt64)
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Project fields.
func (pr *Project) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case project.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			pr.ID = int(value.Int64)
		case project.FieldUUID:
			if value, ok := values[i].(*uuid.UUID); !ok {
				return fmt.Errorf("unexpected type %T for field uuid", values[i])
			} else if value != nil {
				pr.UUID = *value
			}
		case project.FieldSlug:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field slug", values[i])
			} else if value.Valid {
				pr.Slug = value.String
			}
		case project.FieldName:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field name", values[i])
			} else if value.Valid {
				pr.Name = value.String
			}
		case project.FieldUserID:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field user_id", values[i])
			} else if value.Valid {
				pr.UserID = int(value.Int64)
			}
		case project.FieldGoal:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field goal", values[i])
			} else if value.Valid {
				pr.Goal = value.String
			}
		case project.FieldShouldbe:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field shouldbe", values[i])
			} else if value.Valid {
				pr.Shouldbe = value.String
			}
		case project.FieldStatus:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field status", values[i])
			} else if value.Valid {
				pr.Status = project.Status(value.String)
			}
		case project.FieldDeadline:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field deadline", values[i])
			} else if value.Valid {
				pr.Deadline = value.Time
			}
		case project.FieldStartingAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field starting_at", values[i])
			} else if value.Valid {
				pr.StartingAt = new(time.Time)
				*pr.StartingAt = value.Time
			}
		case project.FieldStartedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field started_at", values[i])
			} else if value.Valid {
				pr.StartedAt = new(time.Time)
				*pr.StartedAt = value.Time
			}
		case project.FieldFinishedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field finished_at", values[i])
			} else if value.Valid {
				pr.FinishedAt = new(time.Time)
				*pr.FinishedAt = value.Time
			}
		case project.FieldArchivedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field archived_at", values[i])
			} else if value.Valid {
				pr.ArchivedAt = new(time.Time)
				*pr.ArchivedAt = value.Time
			}
		case project.FieldCreatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field created_at", values[i])
			} else if value.Valid {
				pr.CreatedAt = value.Time
			}
		case project.FieldUpdatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field updated_at", values[i])
			} else if value.Valid {
				pr.UpdatedAt = value.Time
			}
		case project.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for edge-field user_projects", value)
			} else if value.Valid {
				pr.user_projects = new(int)
				*pr.user_projects = int(value.Int64)
			}
		default:
			pr.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the Project.
// This includes values selected through modifiers, order, etc.
func (pr *Project) Value(name string) (ent.Value, error) {
	return pr.selectValues.Get(name)
}

// QueryUsers queries the "users" edge of the Project entity.
func (pr *Project) QueryUsers() *UserQuery {
	return NewProjectClient(pr.config).QueryUsers(pr)
}

// Update returns a builder for updating this Project.
// Note that you need to call Project.Unwrap() before calling this method if this Project
// was returned from a transaction, and the transaction was committed or rolled back.
func (pr *Project) Update() *ProjectUpdateOne {
	return NewProjectClient(pr.config).UpdateOne(pr)
}

// Unwrap unwraps the Project entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (pr *Project) Unwrap() *Project {
	_tx, ok := pr.config.driver.(*txDriver)
	if !ok {
		panic("ent: Project is not a transactional entity")
	}
	pr.config.driver = _tx.drv
	return pr
}

// String implements the fmt.Stringer.
func (pr *Project) String() string {
	var builder strings.Builder
	builder.WriteString("Project(")
	builder.WriteString(fmt.Sprintf("id=%v, ", pr.ID))
	builder.WriteString("uuid=")
	builder.WriteString(fmt.Sprintf("%v", pr.UUID))
	builder.WriteString(", ")
	builder.WriteString("slug=")
	builder.WriteString(pr.Slug)
	builder.WriteString(", ")
	builder.WriteString("name=")
	builder.WriteString(pr.Name)
	builder.WriteString(", ")
	builder.WriteString("user_id=")
	builder.WriteString(fmt.Sprintf("%v", pr.UserID))
	builder.WriteString(", ")
	builder.WriteString("goal=")
	builder.WriteString(pr.Goal)
	builder.WriteString(", ")
	builder.WriteString("shouldbe=")
	builder.WriteString(pr.Shouldbe)
	builder.WriteString(", ")
	builder.WriteString("status=")
	builder.WriteString(fmt.Sprintf("%v", pr.Status))
	builder.WriteString(", ")
	builder.WriteString("deadline=")
	builder.WriteString(pr.Deadline.Format(time.ANSIC))
	builder.WriteString(", ")
	if v := pr.StartingAt; v != nil {
		builder.WriteString("starting_at=")
		builder.WriteString(v.Format(time.ANSIC))
	}
	builder.WriteString(", ")
	if v := pr.StartedAt; v != nil {
		builder.WriteString("started_at=")
		builder.WriteString(v.Format(time.ANSIC))
	}
	builder.WriteString(", ")
	if v := pr.FinishedAt; v != nil {
		builder.WriteString("finished_at=")
		builder.WriteString(v.Format(time.ANSIC))
	}
	builder.WriteString(", ")
	if v := pr.ArchivedAt; v != nil {
		builder.WriteString("archived_at=")
		builder.WriteString(v.Format(time.ANSIC))
	}
	builder.WriteString(", ")
	builder.WriteString("created_at=")
	builder.WriteString(pr.CreatedAt.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("updated_at=")
	builder.WriteString(pr.UpdatedAt.Format(time.ANSIC))
	builder.WriteByte(')')
	return builder.String()
}

// Projects is a parsable slice of Project.
type Projects []*Project
