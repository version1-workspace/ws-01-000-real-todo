package module

import (
	"fmt"
	"net/http"
	"path/filepath"

	"github.com/gorilla/mux"
)

type Moduler interface {
	Register(string)
	AddSub(Moduler)
}

type HandleFunc struct {
	Methods []string
	Path    string
	Handler func(http.ResponseWriter, *http.Request)
}

func RegisterHandlers(r *mux.Router, handlers []HandleFunc, prefix string) {
	for _, h := range handlers {
		pattern := filepath.Clean(fmt.Sprintf("%s/%s", prefix, h.Path))
		r.HandleFunc(pattern, h.Handler).Methods(h.Methods...)
	}
}
