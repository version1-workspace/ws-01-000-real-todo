// Code generated by ent, DO NOT EDIT.

package migrate

import (
	"entgo.io/ent/dialect/sql/schema"
	"entgo.io/ent/schema/field"
)

var (
	// ProjectsColumns holds the columns for the "projects" table.
	ProjectsColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "uuid", Type: field.TypeUUID, Unique: true},
		{Name: "slug", Type: field.TypeString, Unique: true},
		{Name: "name", Type: field.TypeString},
		{Name: "goal", Type: field.TypeString, Size: 2147483647},
		{Name: "shouldbe", Type: field.TypeString, Nullable: true, Size: 2147483647},
		{Name: "status", Type: field.TypeEnum, Enums: []string{"initial", "active", "archived"}, Default: "initial"},
		{Name: "deadline", Type: field.TypeTime},
		{Name: "starting_at", Type: field.TypeTime, Nullable: true},
		{Name: "started_at", Type: field.TypeTime, Nullable: true},
		{Name: "finished_at", Type: field.TypeTime, Nullable: true},
		{Name: "archived_at", Type: field.TypeTime, Nullable: true},
		{Name: "created_at", Type: field.TypeTime},
		{Name: "updated_at", Type: field.TypeTime},
		{Name: "user_projects", Type: field.TypeInt, Nullable: true},
	}
	// ProjectsTable holds the schema information for the "projects" table.
	ProjectsTable = &schema.Table{
		Name:       "projects",
		Columns:    ProjectsColumns,
		PrimaryKey: []*schema.Column{ProjectsColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "projects_users_projects",
				Columns:    []*schema.Column{ProjectsColumns[14]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.SetNull,
			},
		},
		Indexes: []*schema.Index{
			{
				Name:    "project_deadline",
				Unique:  false,
				Columns: []*schema.Column{ProjectsColumns[7]},
			},
		},
	}
	// TasksColumns holds the columns for the "tasks" table.
	TasksColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "uuid", Type: field.TypeUUID, Unique: true},
		{Name: "title", Type: field.TypeString},
		{Name: "status", Type: field.TypeEnum, Enums: []string{"initial", "scheduled", "completed", "archived"}, Default: "initial"},
		{Name: "kind", Type: field.TypeEnum, Enums: []string{"task", "milestone"}, Default: "task"},
		{Name: "deadline", Type: field.TypeTime},
		{Name: "starting_at", Type: field.TypeTime, Nullable: true},
		{Name: "started_at", Type: field.TypeTime, Nullable: true},
		{Name: "finished_at", Type: field.TypeTime, Nullable: true},
		{Name: "archived_at", Type: field.TypeTime, Nullable: true},
		{Name: "created_at", Type: field.TypeTime},
		{Name: "updated_at", Type: field.TypeTime},
		{Name: "project_tasks", Type: field.TypeInt, Nullable: true},
		{Name: "project_milestones", Type: field.TypeInt, Nullable: true},
		{Name: "user_tasks", Type: field.TypeInt, Nullable: true},
	}
	// TasksTable holds the schema information for the "tasks" table.
	TasksTable = &schema.Table{
		Name:       "tasks",
		Columns:    TasksColumns,
		PrimaryKey: []*schema.Column{TasksColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "tasks_projects_tasks",
				Columns:    []*schema.Column{TasksColumns[12]},
				RefColumns: []*schema.Column{ProjectsColumns[0]},
				OnDelete:   schema.SetNull,
			},
			{
				Symbol:     "tasks_projects_milestones",
				Columns:    []*schema.Column{TasksColumns[13]},
				RefColumns: []*schema.Column{ProjectsColumns[0]},
				OnDelete:   schema.SetNull,
			},
			{
				Symbol:     "tasks_users_tasks",
				Columns:    []*schema.Column{TasksColumns[14]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.SetNull,
			},
		},
	}
	// UsersColumns holds the columns for the "users" table.
	UsersColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "uuid", Type: field.TypeUUID, Unique: true},
		{Name: "email", Type: field.TypeString, Unique: true},
		{Name: "username", Type: field.TypeString},
		{Name: "password_digest", Type: field.TypeString},
		{Name: "refresh_token", Type: field.TypeString},
		{Name: "status", Type: field.TypeEnum, Enums: []string{"active", "deactive"}, Default: "active"},
		{Name: "created_at", Type: field.TypeTime},
		{Name: "updated_at", Type: field.TypeTime},
	}
	// UsersTable holds the schema information for the "users" table.
	UsersTable = &schema.Table{
		Name:       "users",
		Columns:    UsersColumns,
		PrimaryKey: []*schema.Column{UsersColumns[0]},
		Indexes: []*schema.Index{
			{
				Name:    "user_email",
				Unique:  true,
				Columns: []*schema.Column{UsersColumns[2]},
			},
			{
				Name:    "user_username",
				Unique:  false,
				Columns: []*schema.Column{UsersColumns[3]},
			},
		},
	}
	// Tables holds all the tables in the schema.
	Tables = []*schema.Table{
		ProjectsTable,
		TasksTable,
		UsersTable,
	}
)

func init() {
	ProjectsTable.ForeignKeys[0].RefTable = UsersTable
	TasksTable.ForeignKeys[0].RefTable = ProjectsTable
	TasksTable.ForeignKeys[1].RefTable = ProjectsTable
	TasksTable.ForeignKeys[2].RefTable = UsersTable
}
