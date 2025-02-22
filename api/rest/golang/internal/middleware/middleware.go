package middleware

import (
	"context"
	"log"
	"net/http"
	"version1-workspace/ws-01-000-real-todo/internal/ent"

	"github.com/gorilla/mux"
)

func Use(r *mux.Router, mwf ...mux.MiddlewareFunc) {
	r.Use(mwf...)
}

func RequestLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Do stuff here
		log.Println(r.RequestURI)
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}

func Auth(fetcher func(ctx context.Context, id int) *ent.User) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			// FIXME: This is a dummy implementation. You should implement a real authentication mechanism.
			u := fetcher(ctx, 0)
			ctx = context.WithValue(ctx, "user", u)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
