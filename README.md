# ws-01-000-real-todo


## Site

https://version1-real-todo.netlify.app

サーバーのプランの影響でログインに失敗することがあるので一度失敗したら少し待ってから再度リトライしてみて下さい。
新規登録は実装していないのでゲストユーザを使って機能を試すことができます。

ID: user.1@example.com
PASSWORD: AndyBobCharrie

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
npm install
npm run start
```
# ws-01-000-real-todo


## How To Run

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

