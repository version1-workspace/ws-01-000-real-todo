# 概要

このリポジトリは、学習用の Todo / プロジェクト管理アプリ `Turvo` です。

主な機能は、ログイン、プロジェクト管理、目標設定、タスク管理です。新規登録やユーザー設定まわりは、学習上の優先度が低いため未実装または外観のみの実装になっています。

正規版の実装は `frontend` と `api` にあります。`frontend` は Next.js / React / Biome / Vitest / Orval の SPA、`api` は Express / Prisma / PostgreSQL の API です。

API 契約は `api-spec/swagger.yaml` で管理し、仕様変更時はバックエンド実装、フロントエンドの API クライアント、E2E テストとの整合性を確認してください。

# 参照ドキュメント

- [ディレクトリ構成](docs/directory.md)
- [CI](docs/ci.md)

# ツール

- gh: GitHub CLI
</INSTRUCTIONS>
