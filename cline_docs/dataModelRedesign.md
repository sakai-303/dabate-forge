# データモデル再設計

## 問題分析

### 既存データモデルの不一致点

1. **エンティティとテーブル構造の不整合**
   - `Knowledge`クラスに`agenda_id`フィールドが存在しないが、データベーステーブルでは外部キーとして必須
   - 一部のエンティティでDTOインターフェースが定義されているが、一貫性がない

2. **命名規則の不一致**
   - UIとフロントエンドコード：`Topic`, `Question`, `Response`などの用語を使用
   - データベースとバックエンド：`Agenda`, `Knowledge`, `Curiosity`などの用語を使用
   - この不一致により、コードの理解と保守が困難になる

3. **テーブル名の形式**
   - `agenda`テーブルは単数形だが、一般的なプラクティスでは複数形が推奨

## 新データモデル設計

### テーブル名の変更
- `users` → そのまま維持（基本的なユーザー情報）
- `agenda` → `topics`（ディスカッションのトピック）
- `knowledge` → `anticipated_questions`（事前に用意した質問と回答）
- `curiosities` → `new_perspectives`（議論から得られた新しい視点や質問）

### 新テーブルの追加
- `conversations` - ユーザーとAIの会話履歴を記録

### テーブル定義

1. **users**
```sql
CREATE TABLE users (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

2. **topics**
```sql
CREATE TABLE topics (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    stance TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

3. **anticipated_questions**
```sql
CREATE TABLE anticipated_questions (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    topic_id VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);
```

4. **new_perspectives**
```sql
CREATE TABLE new_perspectives (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    topic_id VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    context TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);
```

5. **conversations**
```sql
CREATE TABLE conversations (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    topic_id VARCHAR(255) NOT NULL,
    participant VARCHAR(255) NOT NULL,
    summary TEXT,
    message_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);
```

### エンティティモデル定義

```typescript
// User エンティティ
export class User {
    id: string = uuidv4();
    name: string;
    created_at: Date = new Date();
    updated_at: Date = new Date();
    
    constructor(name: string) {
        this.name = name;
    }
}

// Topic エンティティ
export class Topic {
    id: string = uuidv4();
    user_id: string;
    title: string;
    stance: string;
    created_at: Date = new Date();
    updated_at: Date = new Date();

    constructor(user_id: string, title: string, stance: string) {
        this.user_id = user_id;
        this.title = title;
        this.stance = stance;
    }
}

// AnticipatedQuestion エンティティ
export class AnticipatedQuestion {
    id: string = uuidv4();
    topic_id: string;
    question: string;
    response: string;
    created_at: Date = new Date();
    updated_at: Date = new Date();

    constructor(topic_id: string, question: string, response: string) {
        this.topic_id = topic_id;
        this.question = question;
        this.response = response;
    }
}

// NewPerspective エンティティ
export class NewPerspective {
    id: string = uuidv4();
    topic_id: string;
    question: string;
    context: string;
    ai_response: string;
    status: string = 'pending';
    created_at: Date = new Date();
    updated_at: Date = new Date();

    constructor(topic_id: string, question: string, context: string, ai_response: string) {
        this.topic_id = topic_id;
        this.question = question;
        this.context = context;
        this.ai_response = ai_response;
    }
}

// Conversation エンティティ
export class Conversation {
    id: string = uuidv4();
    topic_id: string;
    participant: string;
    summary: string | null = null;
    message_count: number = 0;
    created_at: Date = new Date();
    updated_at: Date = new Date();

    constructor(topic_id: string, participant: string) {
        this.topic_id = topic_id;
        this.participant = participant;
    }
}
```

### DTO定義

各エンティティに対応するDTOインターフェースも定義します：

```typescript
export interface UserDTO {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface TopicDTO {
  id: string;
  user_id: string;
  title: string;
  stance: string;
  created_at: string;
  updated_at: string;
}

export interface AnticipatedQuestionDTO {
  id: string;
  topic_id: string;
  question: string;
  response: string;
  created_at: string;
  updated_at: string;
}

export interface NewPerspectiveDTO {
  id: string;
  topic_id: string;
  question: string;
  context: string;
  ai_response: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationDTO {
  id: string;
  topic_id: string;
  participant: string;
  summary: string | null;
  message_count: number;
  created_at: string;
  updated_at: string;
}
```

## 実装手順

1. **新マイグレーションファイルの作成**
   - 既存のマイグレーションファイルを削除または無効化
   - 新しいテーブル構造用のマイグレーションファイルを作成

2. **エンティティモデルの更新**
   - src/entity.tsを新しいエンティティモデルで置き換え
   - DTOインターフェースを追加または更新

3. **リポジトリレイヤーの実装更新**
   - 各エンティティのCRUD操作を実装
   - テーブル名とフィールド名の変更を反映

4. **サーバーアクションとの連携**
   - モックデータをリポジトリ呼び出しに置き換え
   - APIルートの実装を更新
