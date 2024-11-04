package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type PageInfo struct {
	TotalCount int    `json:"totalCount"`
	Limit      int    `json:"limit"`
	Page       int    `json:"page"`
	HasNext    bool   `json:"hasNext"`
	HasPrev    bool   `json:"hasPrev"`
	SortOrder  string `json:"sortOrder"`
	SortType   string `json:"sortType"`
}

type ResponseBody struct {
	Data     any       `json:"data"`
	PageInfo *PageInfo `json:"pageInfo,omitempty"`
}

type Controller struct {
}

func NewController() *Controller {
	return &Controller{}
}

func (c Controller) Render(w http.ResponseWriter, payload any) {
	res := ResponseBody{
		Data: payload,
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(res); err != nil {
		c.InternalServerError(w, err)
	}
}

type Serializer interface {
	Serialize() map[string]interface{}
}

func (c Controller) RenderMany(w http.ResponseWriter, payload any, pi *PageInfo) {
	res := ResponseBody{
		Data:     payload,
		PageInfo: pi,
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(res); err != nil {
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

func (c Controller) Unauthorized(w http.ResponseWriter, payload any) {
	w.WriteHeader(http.StatusUnauthorized)
	if payload == nil {
		c.Render(w, map[string]string{"message": "Unauthorized"})
	} else {
		c.Render(w, payload)
	}
}
