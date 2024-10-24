package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return withDefaultFields([]ent.Field{
		field.String("email").NotEmpty().Unique(),
		field.String("username").NotEmpty(),
		field.String("password_digest").NotEmpty(),
		field.String("refresh_token").NotEmpty(),
		field.Enum("status").Values("active", "deactive").Default("active"),
	})
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("projects", Project.Type),
	}
}

func (User) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("email").Unique(),
		index.Fields("username"),
	}
}
