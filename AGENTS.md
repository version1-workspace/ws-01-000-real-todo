# 概要

このリポジトリは、学習用の Todo / プロジェクト管理アプリ `Turvo` です。

主な機能は、ログイン、プロジェクト管理、目標設定、タスク管理です。新規登録やユーザー設定まわりは、学習上の優先度が低いため未実装または外観のみの実装になっています。

構成は複数世代の実装を含みます。`frontend/core` は README の起動手順で参照されている既存フロントエンド、`api` は NestJS / TypeORM / MySQL のバックエンド、`next/frontend` と `next/api/node` は次世代構成の Next.js フロントエンドと Express / Prisma / PostgreSQL API です。

API 契約は `api-spec/swagger.yaml` で管理し、仕様変更時はバックエンド実装、フロントエンドの API クライアント、E2E テストとの整合性を確認してください。

# 参照ドキュメント

- [ディレクトリ構成](docs/directory.md)
- [CI](docs/ci.md)

# ツール

- gh: GitHub CLI
</INSTRUCTIONS>
