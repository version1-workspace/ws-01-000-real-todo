//go:build ignore
// +build ignore

package main

import (
	"log"

	"entgo.io/ent/entc"
	"entgo.io/ent/entc/gen"
)

func main() {
	opts := []entc.Option{
		entc.TemplateDir("./internal/ent/template"),
	}
	err := entc.Generate("./internal/ent/schema", &gen.Config{}, opts...)
	if err != nil {
		log.Fatalf("running ent codegen: %v", err)
	}
}
