# 実装計画

## プロジェクト現状分析

### データベース構造
- 4つの主要テーブル（users, agenda, knowledge, curiosities）が定義済み
- 基本的なリレーションシップが設計済み（アジェンダに紐づく知識と好奇心）
- スキーマ設計は完了しているが、マイグレーション状態は未確認

### コードベース
- エンティティモデル（User, Agenda, Knowledge, Curiosity）は適切に定義されている
- リポジトリレイヤーはUser, Knowledge, Curiosityの基本実装があるが、Agenda関連操作が不足
- フロントエンドはNext.jsのApp Routerを使用し、基本的なルーティングとUIが構築済み
- サーバーアクションとAPIルートは大部分がモックデータを返すスタブ実装

### 設定と環境
- docker-compose.ymlでMySQLの環境が準備されている
- .envファイルの設定は最小限（DATABASE_URL）
- リポジトリで使用される環境変数（DB_HOST等）が未定義
- OpenAI APIキーなどのサービス連携設定が不足

## 特定された課題

1. **データアクセスレイヤーの不完全な実装**
   - Agendaリポジトリ操作の実装が不足
   - スタブ実装から実際のデータベース連携への置き換えが必要

2. **環境設定の不足**
   - .env環境変数設定の充実
   - docker-compose.ymlとの一貫性確保

3. **認証機能の欠如**
   - ユーザー認証の仕組みがない
   - アクセス制御が実装されていない

4. **エラーハンドリングの不足**
   - 例外処理やユーザーフィードバックの仕組みが不足

## 実装計画

### フェーズ1: 環境構築と基本機能の実装
1. **.envファイルの整備**
   ```
   # Database
   DATABASE_URL=mysql://root:rootpassword@localhost/debate_forge_development
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=rootpassword
   DB_NAME=debate_forge_development
   
   # OpenAI
   OPENAI_API_KEY=your_api_key
   ```

2. **docker-compose.ymlの修正**
   - MySQLユーザー設定を.envと一致させる

3. **リポジトリ実装の完成**
   - Agendaリポジトリ関数の実装（createAgenda, getAgendas, getAgendaById）
   - 他のエンティティのリポジトリ関数の拡充

4. **環境構築手順**
   - パッケージインストール確認
   - Docker環境起動
   - マイグレーション実行
   - 開発サーバー起動と動作確認

### フェーズ2: 認証とセキュリティ実装（優先度：中）
1. ユーザー認証システムの追加
2. アクセス制御の実装
3. セキュリティ強化

### フェーズ3: フロントエンド充実（優先度：高）
1. UX/UIの改善
2. レスポンシブデザインの強化
3. エラーハンドリングとユーザーフィードバックの充実

### フェーズ4: テストとデプロイ準備（優先度：低）
1. テストの追加
2. デプロイ手順の確立
3. ドキュメント整備

## 実装詳細計画（フェーズ1）

### 環境構築

1. **.envファイルの更新**
   - リポジトリで使用されるDB接続情報を追加
   - OpenAI APIキー設定を追加

2. **docker-compose.ymlの修正**
   - ユーザー設定を.envと一致させる
   - MySQLのヘルスチェック設定維持

3. **依存関係の確認とインストール**
   - `npm install`でパッケージインストール確認
   - 不足している依存関係があれば追加

### リポジトリ実装

1. **Agendaリポジトリ関数の実装**
   - createAgenda: 新しいAgendaの作成
   - getAgendas: 全Agendaの取得
   - getAgendaById: 特定IDのAgenda取得
   - updateAgenda: Agendaの更新
   - deleteAgenda: Agendaの削除

2. **その他リポジトリ関数の拡充**
   - User, Knowledge, Curiosityの更新・削除機能

### サーバーアクション実装

1. **モックデータからデータベース連携への切替**
   - actions.tsのモック関数をリポジトリ呼び出しに置き換え
   - APIルートの実装更新

### 動作検証

1. **基本CRUD操作のテスト**
   - Topic作成機能のテスト
   - Topic一覧表示のテスト
   - Knowledge登録のテスト
   - Curiosity追跡のテスト
