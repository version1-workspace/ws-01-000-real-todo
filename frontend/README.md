# `frontend`

Next.js フロントエンドアプリケーションです。

## API Server について

API サーバーは [../api/node](../api/node) にあります。フロントエンドは API サーバーにリクエストを送信してデータを取得します。

```bash
cd ../api/node
npm install
PORT=3001 npm run dev
```

フロントエンドはブラウザから API へ直接接続せず、`/api/v1/*` の Next.js Route Handler を経由します。`frontend/.env.local` に、完全な API ベース URL（`/api/v1` を含む）を設定してください。

```bash
API_BASE_URL=http://localhost:3001/api/v1
```

Netlify では `API_BASE_URL` をサイトのサーバーランタイム環境変数として設定します。`NEXT_PUBLIC_API_URL` は使用しません。

## API Client

OpenAPI クライアントは Orval で生成しています。

- OpenAPI 定義: [../api-spec/swagger.yaml](../api-spec/swagger.yaml)
- Orval 設定: [orval.config.ts](./orval.config.ts)
- 生成コマンド: `npm run generate:api`
- 生成先: `src/services/api/generated/`

`orval.config.ts` の `input.target` は `../api-spec/swagger.yaml` を参照しています。

## Development

```bash
npm install
npm run generate:api
npm run dev
```

## Build

```bash
npm run build
```
