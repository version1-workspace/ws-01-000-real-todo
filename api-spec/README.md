# Swagger UI

`api-spec/swagger.yaml` を Docker 上の Swagger UI で確認するための `Makefile` ターゲットです。

## E2E

`api-spec` 配下には、起動済み API サーバーへ HTTP リクエストを送り、`swagger.yaml` のレスポンス仕様を検証する TypeScript 製の E2E テストがあります。

サーバーの実装言語には依存せず、`API_BASE_URL` だけ合わせれば実行できます。

```bash
cd api-spec
npm install
API_BASE_URL=http://localhost:3001/api/v1 npm test
```

プロジェクトルートで次を実行してください。

```bash
make swagger-ui
```

起動後は `http://localhost:8080` を開くと確認できます。
