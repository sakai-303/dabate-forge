# Claude Development Guidelines for Dabate Forge

このファイルには、AI代理システム (Dabate Forge) プロジェクトでClaude Code を使用する際のガイドラインと設定が含まれています。

## プロジェクト概要

Dabate Forgeは、議論トピックに対する立場を提供し、AIが代理で議論を行うシステムです。ユーザーが定義したトピックと立場に基づいて、AIが他者との議論を代行します。

> **注意**: AI代理議論システムの具体的な動作仕様はまだ検討中です。実装内容は仕様確定に伴い変更される可能性があります。

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **データベース**: MySQL
- **マイグレーション**: dbmate
- **認証**: NextAuth.js
- **スタイリング**: TailwindCSS v4
- **UIコンポーネント**: Radix UI
- **AI統合**: Vercel AI SDK with OpenAI
- **開発**: Turbopack

## 開発環境セットアップ

### 必要なコマンド

```bash
# 開発サーバー開始
npm run dev

# ビルド
npm run build

# 本番サーバー開始
npm start

# リンター実行
npm run lint

# データベースマイグレーション
npm run migrate:up
npm run migrate:down
npm run migrate:new
```

### 環境変数

以下の環境変数が必要です（`.env.local`に設定）:
- `OPENAI_API_KEY` - OpenAI APIキー
- `NEXTAUTH_SECRET` - NextAuth.js用のシークレット
- `NEXTAUTH_URL` - 認証用のベースURL
- `DATABASE_URL` - MySQL接続文字列

## コーディング規約

### TypeScript

- 厳密な型定義を使用
- `any`型の使用を避ける
- 関数の戻り値型を明示的に定義
- インポートパスには`@/`エイリアスを使用

### React/Next.js

- App Routerを使用
- サーバーコンポーネントを優先
- クライアントコンポーネントには`"use client"`ディレクティブを明示
- ファイルベースルーティングに従う

### スタイリング

- TailwindCSSクラスを使用
- Radix UIコンポーネントを再利用
- レスポンシブデザインを考慮
- `src/components/ui/`にある共通コンポーネントを活用

### データベース

- dbmateを使用したマイグレーション管理
- SQLマイグレーションファイルは`db/migrations/`に配置
- 外部キー制約を適切に設定
- タイムスタンプフィールド（`created_at`, `updated_at`）を含める

## ファイル構成

```
src/
├── app/                    # App Router pages
│   ├── api/               # API routes
│   ├── topics/            # トピック関連ページ
│   ├── feedback/          # フィードバックページ（仮実装）
│   └── conversations/     # 会話履歴ページ（仮実装）
├── components/            # Reactコンポーネント
│   └── ui/               # 再利用可能UIコンポーネント
├── lib/                  # ユーティリティ関数
├── entity.ts             # エンティティ定義
└── repository.ts         # データアクセス層
```

> **注意**: 一部のページ（feedback、conversations）は仮実装であり、仕様確定に伴い構成が変更される可能性があります。

## 開発時の注意事項

### 新機能開発

1. 適切なTypeScript型定義を作成
2. データベーススキーマ変更時はマイグレーションを作成
3. UI変更時はレスポンシブ対応を確認
4. エラーハンドリングを適切に実装

### テスト

- 現在テストフレームワークは設定されていない（検討中）
- 新しいテストを追加する場合は、既存のプロジェクト構造に合わせて設定

> **注意**: テスト戦略とフレームワーク選定は仕様検討中です。

### AI統合

- Vercel AI SDKを使用
- OpenAI APIとの統合は`@ai-sdk/openai`パッケージ経由
- ストリーミングレスポンスに対応

> **注意**: AI統合の具体的な実装パターンと議論ロジックは仕様検討中です。

## コミットメッセージ

以下の形式を推奨：
- `feat:` 新機能追加
- `fix:` バグ修正
- `refactor:` リファクタリング
- `style:` スタイリング変更
- `docs:` ドキュメント更新
- `chore:` その他の変更

## ブランチ戦略

- `main` - 本番ブランチ
- 新機能は`feature/`プレフィックス
- バグ修正は`fix/`プレフィックス
- Claude Codeからの変更は`claude/`プレフィックス

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [dbmate Documentation](https://github.com/amacneil/dbmate)