package renderer

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

type Renderer struct {
}

func NewRenderer() *Renderer {
	return &Renderer{}
}

func (c Renderer) Render(w http.ResponseWriter, payload any) {
	data, err := normalize(payload)
	if err != nil {
		c.InternalServerError(w, err)
		return
	}

	res := ResponseBody{
		Data: data,
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(res); err != nil {
		c.InternalServerError(w, err)
	}
}

type Serializer interface {
	Serialize() (map[string]interface{}, error)
}

type ArraySerializer interface {
	Serialize() ([]map[string]interface{}, error)
}

func normalize(payload any) (any, error) {
	switch v := payload.(type) {
	case Serializer:
		return v.Serialize()
	case ArraySerializer:
		return v.Serialize()
	default:
		return payload, nil
	}
}

func (c Renderer) RenderMany(w http.ResponseWriter, payload any, pi *PageInfo) {
	data, err := normalize(payload)
	if err != nil {
		c.InternalServerError(w, err)
		return
	}

	res := ResponseBody{
		Data:     data,
		PageInfo: pi,
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(res); err != nil {
		c.InternalServerError(w, err)
	}
}

func (c Renderer) InternalServerError(w http.ResponseWriter, payload any) {
	w.WriteHeader(http.StatusInternalServerError)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		panic(fmt.Errorf("failed to render error: %w", err))
	}
}

func (c Renderer) NotFound(w http.ResponseWriter, payload any) {
	w.WriteHeader(http.StatusNotFound)
	if payload == nil {
		c.Render(w, map[string]string{"message": "Not Found"})
	} else {
		c.Render(w, payload)
	}
}

func (c Renderer) BadRequest(w http.ResponseWriter, payload any) {
	w.WriteHeader(http.StatusBadRequest)
	if payload == nil {
		c.Render(w, map[string]string{"message": "Bad Request"})
	} else {
		c.Render(w, payload)
	}
}

func (c Renderer) Unauthorized(w http.ResponseWriter, payload any) {
	w.WriteHeader(http.StatusUnauthorized)
	if payload == nil {
		c.Render(w, map[string]string{"message": "Unauthorized"})
	} else {
		c.Render(w, payload)
	}
}
