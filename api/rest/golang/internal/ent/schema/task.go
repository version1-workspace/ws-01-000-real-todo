package schema

import "entgo.io/ent"

// Task holds the schema definition for the Task entity.
type Task struct {
	ent.Schema
}

// Fields of the Task.
func (Task) Fields() []ent.Field {
	return withDefaultFields([]ent.Field{})
}

// Edges of the Task.
func (Task) Edges() []ent.Edge {
	return nil
}
