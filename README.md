# ws-01-000-real-todo


## Site

https://version1-real-todo.netlify.app

サーバーのプランの影響でログインに失敗することがあるので一度失敗したら少し待ってから再度リトライしてみて下さい。
新規登録は実装していないのでゲストユーザを使って機能を試すことができます。


| | |
| ---- | --- |
| ID | user.1@example.com |
| PASSWORD | AndyBobCharrie |

## How to Run

### Frontend

```
cd frontend/core
npm install
npm run dev
```

### Backend

```
cd api
cp -p .env.development.example .env.development
npm install
npm run db:setup
npm run start:dev
```

## About

Turvo は 学習用のサンプルアプリで

1. モダンなフロントエンド実装
2. モダンなバックエンド実装
3. CI/CD

の機能を含んだアプリです。

一般的な

1. プロジェクト管理
2. 目標設定
3. タスク管理
4. ログイン機能

などの機能が実装されており、反対に学習として優先度の低いと考えられる

1. 新規登録の機能
2. ユーザ設定機能

周りの機能は未実装または外観のみの実装となっています。
これらの機能は将来実装されるかもしれませんが、あくまでも学習用の例として有益であると判断された場合に実装されます。

### 使用技術

#### Frontend

1. React
1. Next.js
1. TypeScript
1. Axios
1. Dayjs
1. ESLint
1. Prettier

### Backend

1. Nest.js(Express)
1. TypeScript
1. TypeORM(MySQL)
1. Joi
1. ESLint
1. Prettier
1. jsonapi-serializer
1. jest

### Misc

| Kind | Name |
| --- | --- |
| CI/CD | Github Action |





