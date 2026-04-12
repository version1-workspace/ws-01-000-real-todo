# `next/frontend`

Next.js フロントエンドアプリケーションです。

## API Server について

API サーバーは [../api](../api) にあります。フロントエンドは API サーバーにリクエストを送信してデータを取得します。

```bash
cd ../api/node
npm install
PORT=7000 npm run dev
```

## API Client

OpenAPI クライアントは Orval で生成しています。

- OpenAPI 定義: [../../api-spec/swagger.yaml](../../api-spec/swagger.yaml)
- Orval 設定: [orval.config.ts](./orval.config.ts)
- 生成コマンド: `npm run generate:api`
- 生成先: `src/services/api/generated/`

`orval.config.ts` の `input.target` は `../../api-spec/swagger.yaml` を参照しています。

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
