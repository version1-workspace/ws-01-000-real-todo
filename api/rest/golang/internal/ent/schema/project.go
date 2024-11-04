package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
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
		field.Text("goal").NotEmpty(),
		field.Text("shouldbe").Optional(),
		field.Enum("status").Values("initial", "active", "archived").Default("initial"),
		field.Time("deadline"),
		field.Time("starting_at").Nillable().Optional(),
		field.Time("started_at").Nillable().Optional(),
		field.Time("finished_at").Nillable().Optional(),
		field.Time("archived_at").Nillable().Optional(),
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

func (Project) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("user_id"),
		index.Fields("deadline"),
	}
}
