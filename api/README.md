# api

Express + Prisma で `api-spec/swagger.yaml` の契約を実装した API です。

## セットアップ

```bash
cd api
cp .env.example .env
docker compose up -d
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run dev
```

起動後のベース URL は `http://localhost:3001/api/v1` です。
