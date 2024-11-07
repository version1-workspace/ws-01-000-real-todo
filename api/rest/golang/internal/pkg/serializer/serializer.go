package serializer

import (
	"strings"
)

type valueGetter interface {
	Values(string) (any, error)
}

type mapSerializer interface {
	Serialize() (map[string]any, error)
}

func SerialzieCollection[T mapSerializer](list []T) ([]map[string]any, error) {
	payload := []map[string]any{}
	for _, p := range list {
		v, err := p.Serialize()
		if err != nil {
			return nil, err
		}
		payload = append(payload, v)
	}

	return payload, nil
}

func Serialize(getter valueGetter, cols []string) (map[string]any, error) {
	m := map[string]any{}
	for i := range cols {
		if cols[i] == "id" {
			continue
		}
		v, err := getter.Values(cols[i])
		if err != nil {
			return nil, err
		}
		key := snake2camel(cols[i])
		m[key] = v
	}

	return m, nil
}

func snake2camel(s string) string {
	res := ""
	for _, v := range strings.Split(s, "_") {
		if len(v) > 0 {
			res += strings.ToUpper(string(v[0])) + v[1:]
		}
	}

	if len(res) > 0 {
		return strings.ToLower(string(res[0])) + res[1:]
	}

	return res
}
