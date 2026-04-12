# CI

GitHub Actions は用途ごとに workflow を分割しています。すべて `push` をトリガーに実行されます。

- `fe.yml`
  `frontend/core` を対象に `npm install`、lint、TypeScript compile、test、build を実行します。
- `be.yml`
  `api` を対象に `npm install`、lint、compile、build、unit test に加えて、MySQL を使った E2E を実行します。
- `next-api.yml`
  `next/api/node` を対象に依存関係の導入、Prisma Client 生成、Vitest、build を実行します。
- `e2e.yml`
  PostgreSQL をサービスとして起動し、`next/api/node` を build / migrate / seed / 起動したうえで、`api-spec` 配下の TypeScript 製 E2E から `swagger.yaml` の仕様検証を行います。

共通処理は `.github/actions/` 配下の composite action に切り出しています。

- `.github/actions/setup-node-project`
  Node.js のセットアップ、npm キャッシュ、`npm install`
- `.github/actions/prepare-next-api`
  `next/api/node` 用のセットアップと Prisma Client 生成
- `.github/actions/wait-for-http`
  HTTP エンドポイントの起動待ち
