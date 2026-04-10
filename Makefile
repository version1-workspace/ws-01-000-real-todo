.PHONY: swagger-ui

swagger-ui:
	docker run --rm -p 8080:8080 \
		-e SWAGGER_JSON=/app/swagger.yaml \
		-v "$(CURDIR)/api-spec/swagger.yaml:/app/swagger.yaml" \
		swaggerapi/swagger-ui
