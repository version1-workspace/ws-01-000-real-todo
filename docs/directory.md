# ディレクトリ構成

このリポジトリは、学習用の Todo / プロジェクト管理アプリを構成するフロントエンド、バックエンド、API 仕様、運用ドキュメントを含みます。

正規版の実装は `frontend/` と `api/node/` にあります。旧世代の `frontend/core/`、NestJS / TypeORM 版バックエンド、開発中構成の `next/` は削除されました。

## ルート

| パス | 役割 |
| --- | --- |
| `README.md` | プロジェクト概要、起動手順、デモ環境、使用技術の入口です。 |
| `AGENTS.md` | エージェント向けの作業方針、応答言語、設計方針を定義します。 |
| `CLAUDE.md` | `AGENTS.md` への symlink です。Claude 系ツールから同じ作業方針を参照します。 |
| `Makefile` | ルートから実行する補助コマンドを定義します。Swagger UI と本番想定 compose 操作に使います。 |
| `compose.prd.yml` | 本番想定の compose 設定です。 |
| `docker/` | 本番構成向けの Docker / Nginx 設定を置きます。 |
| `docs/` | CI やディレクトリ構成など、リポジトリ横断の開発者向けドキュメントを置きます。 |
| `api-spec/` | OpenAPI 仕様と、仕様に対する E2E 検証を管理します。 |
| `api/` | API 実装を言語・ランタイム別に配置するルートです。 |
| `api/node/` | Express / Prisma / PostgreSQL で実装された Node.js API です。 |
| `frontend/` | Next.js / React / Biome / Vitest / Orval で実装されたフロントエンドです。 |

## `docs/`

| パス | 役割 |
| --- | --- |
| `docs/ci.md` | GitHub Actions の workflow と composite action の説明です。 |
| `docs/directory.md` | このファイルです。リポジトリ内の主要ディレクトリの役割を説明します。 |
| `docs/design.md` | アプリケーション設計メモです。 |
| `docs/frontend-design.md` | フロントエンド実装時の設計方針です。 |

## `api-spec/`

OpenAPI の契約を管理するディレクトリです。

| パス | 役割 |
| --- | --- |
| `api-spec/swagger.yaml` | API 仕様の本体です。フロントエンド生成コードや E2E の基準になります。 |
| `api-spec/tests/` | `swagger.yaml` に基づいて API の振る舞いを検証するテストを置きます。 |
| `api-spec/tests/support/` | OpenAPI 読み込みや HTTP クライアントなど、仕様テストの補助処理を置きます。 |
| `api-spec/package.json` | 仕様検証用の npm scripts と依存関係を定義します。 |

API の入出力契約を変更する場合は、実装だけでなく `swagger.yaml` と関連テストの更新も確認してください。

## `api/`

API 実装を言語・ランタイム別に配置するディレクトリです。現在の正規版 API は `api/node/` にあります。Go など別実装を追加する場合は、`api/go/` のように実装単位でディレクトリを分けます。

## `api/node/`

Express と Prisma を使った Node.js API 実装です。

| パス | 役割 |
| --- | --- |
| `api/node/src/server.ts` | API サーバーの起動点です。 |
| `api/node/src/app.ts` | Express アプリケーションの組み立てを行います。 |
| `api/node/src/routes/` | ルーティング定義を置きます。 |
| `api/node/src/controllers/` | HTTP リクエストとレスポンスの境界を扱います。 |
| `api/node/src/services/` | ユースケースやアプリケーションロジックを置きます。 |
| `api/node/src/models/` | Prisma などの永続化層に近いモデル操作を置きます。 |
| `api/node/src/middlewares/` | 認証、エラーハンドリング、404 などの Express middleware を置きます。 |
| `api/node/src/lib/` | 認証、パスワード、ページネーション、serializer、HTTP error などの共通処理を置きます。 |
| `api/node/src/config/` | 環境変数や認証設定を置きます。 |
| `api/node/prisma/` | Prisma schema、migration、seed を置きます。 |
| `api/node/compose.yaml` | ローカル開発用の PostgreSQL を起動する compose 設定です。 |

Prisma schema を変更した場合は、migration、seed、service / model 層、関連テストの更新も合わせて確認してください。

## `frontend/`

Next.js を使ったフロントエンド実装です。

| パス | 役割 |
| --- | --- |
| `frontend/src/app/` | App Router のページ、レイアウト、画面単位のセットアップを置きます。 |
| `frontend/src/components/` | 画面横断で使う UI コンポーネントを置きます。 |
| `frontend/src/contexts/` | タスク、プロジェクト、通知などの React Context を置きます。 |
| `frontend/src/hooks/` | 再利用する React hooks を置きます。 |
| `frontend/src/lib/` | 日付、ルーティング、toast、query string などの共通処理を置きます。 |
| `frontend/src/services/api/` | API クライアントと Orval 生成コードを置きます。 |
| `frontend/src/viewmodels/` | API モデルと画面表示の間に置く view model を管理します。 |
| `frontend/public/` | 静的アセットを置きます。 |

`frontend/src/services/api/generated/` は OpenAPI 仕様から生成されるコードです。手作業で直接編集する前に、生成元と `generate:api` の利用可否を確認してください。

## `docker/`

| パス | 役割 |
| --- | --- |
| `docker/nginx/` | 本番構成向けの Nginx 設定を置きます。 |

## 生成物・依存ディレクトリ

以下は通常、手作業で編集しません。

| パス | 扱い |
| --- | --- |
| `node_modules/` | npm によって復元される依存パッケージです。 |
| `dist/` | TypeScript などのビルド成果物です。 |
| `out/` | Next.js の静的出力です。 |
| `.tmp/` | テスト実行時などに作られる一時ディレクトリです。 |
| `generated/` | Prisma Client などの生成コードです。 |
| `tsconfig.tsbuildinfo` | TypeScript の incremental build 情報です。 |

生成物に見えるファイルを変更する必要がある場合は、生成元のコード、設定、仕様を先に確認してください。
