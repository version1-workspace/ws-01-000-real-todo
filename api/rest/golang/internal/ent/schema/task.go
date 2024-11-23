package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Task holds the schema definition for the Task entity.
type Task struct {
	ent.Schema
}

// Fields of the Task.
func (Task) Fields() []ent.Field {
	return withDefaultFields([]ent.Field{
		field.String("title").NotEmpty(),
		field.Enum("status").Values("initial", "scheduled", "completed", "archived").Default("initial"),
		field.Enum("kind").Values("task", "milestone").Default("task"),
		field.Time("deadline"),
		field.Time("starting_at").Nillable().Optional(),
		field.Time("started_at").Nillable().Optional(),
		field.Time("finished_at").Nillable().Optional(),
		field.Time("archived_at").Nillable().Optional(),
	})
}

// Edges of the Task.
func (Task) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("project", Project.Type).
			Ref("tasks").
			Unique(),
		edge.From("milestoneParent", Project.Type).
			Ref("milestones").
			Unique(),
		edge.From("user", User.Type).
			Ref("tasks").
			Unique(),
	}
}

func (Task) Indexes() []ent.Index {
	return []ent.Index{}
}
