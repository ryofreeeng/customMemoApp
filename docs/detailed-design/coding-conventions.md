# コーディング規約

このプロジェクト（customMemoApp）における命名規則・コーディングスタイルの方針。

---

## 命名規則

### SQL 列名・DBエンティティ型のプロパティ

**snake_case で統一する。**

```sql
-- SQL（列名は snake_case）
CREATE TABLE FOLDER (
  id         INTEGER PRIMARY KEY,
  parent_id  INTEGER,
  created_at TEXT NOT NULL
);
```

```typescript
// DBエンティティ型（列名と一致させて snake_case）
interface Folder {
  id: number;
  parent_id: number | null;
  created_at: string;
}
```

**理由：** SQL は大文字小文字を区別しない仕様のため、業界慣習として snake_case が定着している。DBの列名とTypeScriptのプロパティ名を一致させることで、取得したデータをそのまま型として扱える（変換処理が不要）。

---

### TypeScript（コンポーネント・Props・関数・変数）

**camelCase で統一する（TypeScript / JavaScript の標準慣習）。**

```typescript
// コンポーネント名は PascalCase
function NoteCard() { ... }

// Props・変数・関数名は camelCase
const folderId = 1;
function getFolderContents() { ... }
```

---

### まとめ

| 対象 | 命名規則 | 例 |
|---|---|---|
| SQL テーブル名 | UPPER_SNAKE_CASE | `FOLDER`・`NOTE` |
| SQL 列名 | snake_case | `parent_id`・`created_at` |
| DBエンティティ型のプロパティ | snake_case | `parent_id`・`created_at` |
| TypeScript 変数・関数 | camelCase | `folderId`・`getFolderContents` |
| TypeScript コンポーネント・型名 | PascalCase | `NoteCard`・`MemoListMode` |
