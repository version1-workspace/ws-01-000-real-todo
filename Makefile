.PHONY: swagger-ui prd-api-up prd-api-down prd-api-logs prd-api-build prd-api-ps prd-api-console prd-api-migrate prd-api-seed

swagger-ui:
	docker run --rm -p 8080:8080 \
		-e SWAGGER_JSON=/app/swagger.yaml \
		-v "$(CURDIR)/api-spec/swagger.yaml:/app/swagger.yaml" \
		swaggerapi/swagger-ui

prd-api-up:
	docker compose -f compose.prd.yml up -d

prd-api-down:
	docker compose -f compose.prd.yml down

prd-api-logs:
	docker compose -f compose.prd.yml logs -f

prd-api-build:
	docker compose -f compose.prd.yml build

prd-api-ps:
	docker compose -f compose.prd.yml ps

prd-api-console:
	docker compose -f compose.prd.yml exec app sh

prd-api-migrate:
	docker compose -f compose.prd.yml exec app npm run prisma:migrate

prd-api-seed:
	docker compose -f compose.prd.yml exec app npm run prisma:seed
