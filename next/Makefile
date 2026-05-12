
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
	docker compose -f compose.prd.yml exec api sh

prd-api-migrate:
	docker compose -f compose.prd.yml exec app npm run prisma:migrate

prd-api-seed:
	docker compose -f compose.prd.yml exec app npm run prisma:seed
