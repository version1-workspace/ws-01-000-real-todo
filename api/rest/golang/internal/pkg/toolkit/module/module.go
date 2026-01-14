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
	Group   string
	Handler func(http.ResponseWriter, *http.Request)
}

var _ Moduler = &Module{}

type Module struct {
	Name       string
	BasePath   string
	Router     *mux.Router
	Handlers   []HandleFunc
	submodules []Moduler
}

func (m *Module) Register(prefix string) {
	_prefix := filepath.Clean(fmt.Sprintf("%s/%s", prefix, m.BasePath))
	RegisterHandlers(m.Router, m.Handlers, _prefix)
	for _, sub := range m.submodules {
		sub.Register(_prefix)
	}
}

func (m *Module) AddSub(sub Moduler) {
	m.submodules = append(m.submodules, sub)
}

func (m Module) Filter(group string) *Module {
	list := []HandleFunc{}
	for _, h := range m.Handlers {
		if h.Group == group {
			list = append(list, h)
		}
	}
	m.Handlers = list

	return &m
}

func RegisterHandlers(r *mux.Router, handlers []HandleFunc, prefix string) {
	for _, h := range handlers {
		pattern := filepath.Clean(fmt.Sprintf("%s/%s", prefix, h.Path))
		r.HandleFunc(pattern, h.Handler).Methods(h.Methods...)
	}
}
