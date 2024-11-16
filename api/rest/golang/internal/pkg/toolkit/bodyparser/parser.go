package bodyparser

import (
	"encoding/json"
	"net/http"
)

func Parse(r *http.Request, v any) error {
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		return err
	}

	defer r.Body.Close()

	return nil
}
