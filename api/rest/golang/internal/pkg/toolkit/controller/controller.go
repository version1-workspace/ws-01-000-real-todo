package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Controller struct {
}

func NewController() *Controller {
	return &Controller{}
}

func (c Controller) Render(w http.ResponseWriter, payload any) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		c.InternalServerError(w, err)
	}
}

func (c Controller) InternalServerError(w http.ResponseWriter, payload any) {
	w.WriteHeader(http.StatusInternalServerError)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		panic(fmt.Errorf("failed to render error: %w", err))
	}
}

func (c Controller) NotFound(w http.ResponseWriter, payload any) {
	w.WriteHeader(http.StatusNotFound)
	if payload == nil {
		c.Render(w, map[string]string{"message": "Not Found"})
	} else {
		c.Render(w, payload)
	}
}

func (c Controller) BadRequest(w http.ResponseWriter, payload any) {
	w.WriteHeader(http.StatusBadRequest)
	if payload == nil {
		c.Render(w, map[string]string{"message": "Bad Request"})
	} else {
		c.Render(w, payload)
	}
}
