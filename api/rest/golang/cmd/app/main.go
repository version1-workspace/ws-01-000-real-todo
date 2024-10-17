package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"version1-workspace/ws-01-000-real-todo/internal/domains/user"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		fmt.Println("Request received")
		// The "/" pattern matches everything, so we need to check
		// that we're at the root here.
		if req.URL.Path != "/" {
			http.NotFound(w, req)
			return
		}
		fmt.Fprintf(w, "Welcome to the home page!")
	}).Methods(http.MethodGet)
	userModule := user.New(r)
	userModule.Register()

	err := r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
		pathTemplate, err := route.GetPathTemplate()
		if err != nil {
			return err
		}

		methods, err := route.GetMethods()
		if err != nil {
			return err
		}
		fmt.Println(fmt.Sprintf("%s %s", strings.Join(methods, ","), pathTemplate))
		return nil
	})
	if err != nil {
		panic(err)
	}

	port := "8000"
	fmt.Printf("Server is running on port %s\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), r))
}
