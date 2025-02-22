package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

func withDefaultFields(fields []ent.Field) []ent.Field {
	res := []ent.Field{
		field.UUID("uuid", uuid.UUID{}).Default(uuid.New).Unique(),
	}
	res = append(res, fields...)
	res = append(res, []ent.Field{
		field.Time("created_at").Immutable().Default(time.Now),
		field.Time("updated_at").Default(time.Now),
	}...)

	return res
}
