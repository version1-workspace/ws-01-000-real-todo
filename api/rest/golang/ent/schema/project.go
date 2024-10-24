package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Project holds the schema definition for the Project entity.
type Project struct {
	ent.Schema
}

// Fields of the Project.
func (Project) Fields() []ent.Field {
	return withDefaultFields([]ent.Field{
		field.String("slug").NotEmpty().Unique(),
		field.String("name").NotEmpty(),
		field.Int("user_id").Positive(),
		field.Text("goal").NotEmpty().Optional(),
		field.Text("shouldbe").NotEmpty().Optional(),
		field.Enum("status").Values("initial", "active", "archived").Default("initial"),
		field.Time("deadline"),
		field.Time("starting_at").Optional(),
		field.Time("started_at").Optional(),
		field.Time("finished_at").Optional(),
		field.Time("archived_at").Optional(),
	})
}

// Edges of the Project.
func (Project) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("users", User.Type).
			Ref("projects").
			Unique(),
	}
}
