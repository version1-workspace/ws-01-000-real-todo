# ディレクトリ構成

このリポジトリは、学習用の Todo / プロジェクト管理アプリを構成するフロントエンド、バックエンド、API 仕様、運用ドキュメントを含みます。

主要な実装は複数世代の構成が並んでいるため、変更時は対象ディレクトリを確認してから作業してください。

## ルート

| パス | 役割 |
| --- | --- |
| `README.md` | プロジェクト概要、起動手順、デモ環境、使用技術の入口です。 |
| `AGENTS.md` | エージェント向けの作業方針、応答言語、設計方針を定義します。 |
| `Makefile` | ルートから実行する補助コマンドを定義します。現在は Swagger UI 起動に使います。 |
| `docs/` | CI やディレクトリ構成など、リポジトリ横断の開発者向けドキュメントを置きます。 |
| `api-spec/` | OpenAPI 仕様と、仕様に対する E2E 検証を管理します。 |
| `api/` | NestJS / TypeORM / MySQL で実装されたバックエンドです。 |
| `frontend/core/` | Next.js フロントエンドの既存実装です。README の起動手順はこちらを参照しています。 |
| `next/` | 次世代構成のフロントエンド、Node API、Docker / Nginx 設定をまとめます。 |

## `docs/`

| パス | 役割 |
| --- | --- |
| `docs/ci.md` | GitHub Actions の workflow と composite action の説明です。 |
| `docs/directory.md` | このファイルです。リポジトリ内の主要ディレクトリの役割を説明します。 |

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

NestJS を使ったバックエンド実装です。

| パス | 役割 |
| --- | --- |
| `api/src/main.ts` | NestJS アプリケーションの起動点です。 |
| `api/src/app.module.ts` | アプリケーション全体の NestJS module 構成を定義します。 |
| `api/src/config/` | アプリケーション設定を管理します。 |
| `api/src/db/` | TypeORM の設定、マイグレーション、DB 初期化 CLI、seed を置きます。 |
| `api/src/domains/` | 認証、ユーザー、プロジェクト、タスク、タグなどのドメインごとの module / controller / service / entity を置きます。 |
| `api/src/entities/` | 共通 entity や DTO 系の基底定義を置きます。 |
| `api/src/lib/` | ロガー、DataSource、共通 utility など、ドメイン横断の補助処理を置きます。 |
| `api/test/` | Supertest などを使った E2E テストを置きます。 |
| `api/docker-compose.yml` | ローカル開発用の MySQL など、バックエンド周辺サービスを起動する設定です。 |

DB スキーマや永続化に関わる変更では、`api/src/db/migrations/`、entity、E2E テストの整合性を確認してください。

## `frontend/core/`

Next.js を使った既存フロントエンド実装です。

| パス | 役割 |
| --- | --- |
| `frontend/core/src/app/` | App Router のページ、レイアウト、画面単位のセットアップを置きます。 |
| `frontend/core/src/components/` | 画面を構成する再利用 UI コンポーネントを置きます。 |
| `frontend/core/src/contexts/` | タスク、プロジェクト、通知などの React Context を置きます。 |
| `frontend/core/src/hooks/` | 画面やコンポーネントから再利用する React hooks を置きます。 |
| `frontend/core/src/lib/` | 日付、ルーティング、toast、query string などの共通処理を置きます。 |
| `frontend/core/src/services/api/` | API クライアント、モデル、mock を置きます。 |
| `frontend/core/public/` | ブラウザへ配信する静的アセットを置きます。 |
| `frontend/core/src/assets/` | アプリ内部から import する画像やスタイル変数を置きます。 |

README のフロントエンド起動手順は `frontend/core` を対象にしています。

## `next/`

次世代構成のアプリケーションとデプロイ関連ファイルをまとめたディレクトリです。

| パス | 役割 |
| --- | --- |
| `next/frontend/` | Next.js / React / Biome / Vitest / Orval を使うフロントエンド実装です。 |
| `next/api/node/` | Express / Prisma / PostgreSQL を使う Node API 実装です。 |
| `next/docker/nginx/` | 本番構成向けの Nginx 設定を置きます。 |
| `next/compose.prd.yml` | 本番想定の compose 設定です。 |
| `next/docs/` | `next` 配下に閉じた設計メモを置きます。 |
| `next/Makefile` | `next` 配下の補助コマンドを定義します。 |

### `next/frontend/`

| パス | 役割 |
| --- | --- |
| `next/frontend/src/app/` | App Router のページ、レイアウト、画面単位のセットアップを置きます。 |
| `next/frontend/src/components/` | 画面横断で使う UI コンポーネントを置きます。 |
| `next/frontend/src/contexts/` | タスク、プロジェクト、通知などの React Context を置きます。 |
| `next/frontend/src/hooks/` | 再利用する React hooks を置きます。 |
| `next/frontend/src/lib/` | 日付、ルーティング、toast、query string などの共通処理を置きます。 |
| `next/frontend/src/services/api/` | API クライアントと Orval 生成コードを置きます。 |
| `next/frontend/src/viewmodels/` | API モデルと画面表示の間に置く view model を管理します。 |
| `next/frontend/public/` | 静的アセットを置きます。 |

`next/frontend/src/services/api/generated/` は OpenAPI 仕様から生成されるコードです。手作業で直接編集する前に、生成元と `generate:api` の利用可否を確認してください。

### `next/api/node/`

| パス | 役割 |
| --- | --- |
| `next/api/node/src/server.ts` | Node API の起動点です。 |
| `next/api/node/src/app.ts` | Express アプリケーションの組み立てを行います。 |
| `next/api/node/src/routes/` | ルーティング定義を置きます。 |
| `next/api/node/src/controllers/` | HTTP リクエストとレスポンスの境界を扱います。 |
| `next/api/node/src/services/` | ユースケースやアプリケーションロジックを置きます。 |
| `next/api/node/src/models/` | Prisma などの永続化層に近いモデル操作を置きます。 |
| `next/api/node/src/middlewares/` | 認証、エラーハンドリング、404 などの Express middleware を置きます。 |
| `next/api/node/src/lib/` | 認証、パスワード、ページネーション、serializer、HTTP error などの共通処理を置きます。 |
| `next/api/node/src/config/` | 環境変数や認証設定を置きます。 |
| `next/api/node/prisma/` | Prisma schema、migration、seed を置きます。 |

Prisma schema を変更した場合は、migration、seed、service / model 層、関連テストの更新も合わせて確認してください。

## 生成物・依存ディレクトリ

以下は通常、手作業で編集しません。

| パス | 扱い |
| --- | --- |
| `node_modules/` | npm によって復元される依存パッケージです。 |
| `dist/` | TypeScript / NestJS などのビルド成果物です。 |
| `out/` | Next.js の静的出力です。 |
| `.tmp/` | テスト実行時などに作られる一時ディレクトリです。 |
| `tsconfig.tsbuildinfo` | TypeScript の incremental build 情報です。 |

生成物に見えるファイルを変更する必要がある場合は、生成元のコード、設定、仕様を先に確認してください。
