# 認証設計

## 概要

このアプリケーションの認証は、AccessToken と RefreshToken の責務を分けて管理する。

AccessToken は API 呼び出し用の短期 token としてフロントエンドのインメモリにだけ保持する。RefreshToken は AccessToken 再発行用の長期 token として HttpOnly Cookie にだけ保持する。

## Token 管理ルール

### AccessToken

- 有効期間は 30 分。
- フロントエンドのインメモリにのみ保持する。
- `sessionStorage`、`localStorage`、Cookie には保存しない。
- API 呼び出し時は `Authorization: Bearer <accessToken>` で送信する。
- API 側は AccessToken Cookie を認証材料として扱わない。
- JWT payload には refreshToken を含めない。

### RefreshToken

- HttpOnly Cookie の `refreshToken` として保持する。
- レスポンス body には返さない。
- DB には token 本体、有効期限、RememberMe 状態を保存する。
- 有効期限は 2 週間。
- `/auth/refresh` 成功時に毎回ローテーションし、Cookie と DB 保存値を更新する。
- 期限切れ、未登録、不一致の token は 401 として扱い、Cookie を clear する。

## RememberMe

ログイン時の `rememberMe` によって RefreshToken Cookie の寿命だけを変える。

- `rememberMe=true`: 2 週間の永続 Cookie。
- `rememberMe=false` または未指定: session cookie。

どちらの場合も、サーバー側の refreshToken 有効期限は 2 週間を上限とする。

## ログイン

`/auth/login` は email、password、任意の rememberMe を受け取る。

ログイン成功時は以下を行う。

- AccessToken を response body に返す。
- RefreshToken を HttpOnly Cookie にセットする。
- RefreshToken の DB 保存値、有効期限、RememberMe 状態を更新する。

response body に RefreshToken は含めない。

## AccessToken 期限切れ時

フロントエンドは API 呼び出しで 401 を受けた場合、`/auth/refresh` を呼び出して AccessToken の再発行を試みる。

refresh 成功時は以下を行う。

- 新しい AccessToken をインメモリに保持する。
- 元の API リクエストを 1 回だけ再試行する。

refresh 失敗時は以下を行う。

- インメモリの AccessToken を破棄する。
- ログイン画面へ遷移する。

無限 retry を避けるため、元リクエストの再試行は 1 回だけに制限する。

## refresh 多重実行の抑止

複数 API が同時に 401 になった場合でも、`/auth/refresh` は 1 本だけ実行する。

RefreshToken は refresh 成功時にローテーションされるため、同時に複数 refresh を実行すると、後続リクエストが古い RefreshToken を使って失敗する可能性がある。フロントエンドでは refresh 中の Promise を共有し、同時 401 のリクエストは同じ refresh 結果を待つ。

## ログアウト

ログアウト時は以下を行う。

- RefreshToken Cookie を clear する。
- DB に保存された RefreshToken を失効させる。
- フロントエンドのインメモリ AccessToken を破棄する。
- ログイン画面へ遷移する。

Cookie を消すだけではサーバー側の token が有効なまま残るため、DB 側の失効も必須とする。

## API 契約

### `/auth/login`

- request body: email、password、rememberMe。
- response body: uuid、accessToken。
- Set-Cookie: refreshToken。

### `/auth/refresh`

- request body は不要。
- request Cookie の refreshToken を使う。
- response body: uuid、accessToken。
- Set-Cookie: ローテーション後の refreshToken。

### 認証付き API

- `Authorization: Bearer <accessToken>` が必須。
- AccessToken Cookie は受け付けない。

## 現在のスコープ外

- 複数端末・複数セッション管理。
- RefreshToken 専用テーブル化。
- CSRF 対策の追加設計。
- OAuth / 外部 IdP。
- 権限・ロール管理。

## 運用上の注意

User テーブルには RefreshToken 管理用のカラムがあるため、環境構築やデプロイ時は Prisma schema の反映が必要になる。

ローカル DB へ反映する場合は `api/node` 配下で Prisma の DB 反映コマンドを実行する。
