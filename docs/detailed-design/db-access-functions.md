# DBアクセス関数一覧（第1サイクル）

第1サイクル（メモ一覧・新規作成・移動先選択）で使用するDBアクセス関数の定義。  
実装ファイルの想定パス：`src/db/index.ts`

- テーブル定義：[docs/basic-design/table-definition.md](../basic-design/table-definition.md)
- SQLはすべてSQLiteで動作する形式。`?` はバインドパラメータ（実行時に値を渡す）

---

## 型定義

```typescript
interface Folder {
  id: number;
  name: string;
  parent_id: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Note {
  id: number;
  title: string;
  folder_id: number | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
```

---

## 取得系

### getFolderContents
指定フォルダ直下のフォルダ一覧とメモ一覧を取得する。メモ一覧画面で使用。

```typescript
getFolderContents(folderId: number | null): Promise<{ folders: Folder[], notes: Note[] }>
```

| 引数 | 型 | 説明 |
|---|---|---|
| folderId | `number \| null` | 表示するフォルダのID。NULLはルート直下 |

```sql
-- フォルダ一覧（五十音順）
SELECT * FROM FOLDER
WHERE parent_id IS ?  AND deleted_at IS NULL
ORDER BY name ASC;

-- メモ一覧（最終更新日降順）
SELECT * FROM NOTE
WHERE folder_id IS ? AND deleted_at IS NULL
ORDER BY updated_at DESC;
```

---

### getFolders
指定フォルダ直下のフォルダ一覧のみ取得する。移動先選択画面で使用（メモは移動先にならないため除外）。

```typescript
getFolders(parentId: number | null): Promise<Folder[]>
```

| 引数 | 型 | 説明 |
|---|---|---|
| parentId | `number \| null` | 表示するフォルダのID。NULLはルート直下 |

```sql
SELECT * FROM FOLDER
WHERE parent_id IS ? AND deleted_at IS NULL
ORDER BY name ASC;
```

---

## 作成系

### createFolder
新しいフォルダを作成する。戻り値は作成されたフォルダのID。

```typescript
createFolder(name: string, parentId: number | null): Promise<number>
```

| 引数 | 型 | 説明 |
|---|---|---|
| name | `string` | フォルダ名 |
| parentId | `number \| null` | 作成先フォルダのID。NULLはルート直下 |

```sql
INSERT INTO FOLDER (name, parent_id, created_at, updated_at)
VALUES (?, ?, ?, ?);
-- created_at・updated_atにはISO8601形式の現在時刻を渡す
```

---

### createNote
新しいメモを作成する。戻り値は作成されたメモのID。

```typescript
createNote(title: string, folderId: number): Promise<number>
```

| 引数 | 型 | 説明 |
|---|---|---|
| title | `string` | メモのタイトル |
| folderId | `number` | 作成先フォルダのID（H-1決定：メモは必ずフォルダに属する） |

```sql
INSERT INTO NOTE (title, folder_id, created_at, updated_at)
VALUES (?, ?, ?, ?);
```

---

## 名前変更系

### renameFolder
フォルダの名前を変更する。

```typescript
renameFolder(id: number, newName: string): Promise<void>
```

```sql
UPDATE FOLDER SET name = ?, updated_at = ? WHERE id = ?;
```

---

### renameNote
メモのタイトルを変更する。

```typescript
renameNote(id: number, newTitle: string): Promise<void>
```

```sql
UPDATE NOTE SET title = ?, updated_at = ? WHERE id = ?;
```

---

## ゴミ箱移動（ソフトデリート）系

### trashFolder
フォルダをゴミ箱に移動する（`deleted_at` に削除日時を入れる）。

```typescript
trashFolder(id: number): Promise<void>
```

```sql
UPDATE FOLDER SET deleted_at = ?, updated_at = ? WHERE id = ?;
-- deleted_atにはISO8601形式の現在時刻を渡す
```

---

### trashNote
メモをゴミ箱に移動する（`deleted_at` に削除日時を入れる）。

```typescript
trashNote(id: number): Promise<void>
```

```sql
UPDATE NOTE SET deleted_at = ?, updated_at = ? WHERE id = ?;
```

---

## 移動系

### moveFolder
フォルダを別のフォルダに移動する。

```typescript
moveFolder(id: number, destinationParentId: number | null): Promise<void>
```

| 引数 | 型 | 説明 |
|---|---|---|
| id | `number` | 移動するフォルダのID |
| destinationParentId | `number \| null` | 移動先フォルダのID。NULLはルート直下 |

```sql
UPDATE FOLDER SET parent_id = ?, updated_at = ? WHERE id = ?;
```

---

### moveNote
メモを別のフォルダに移動する。

```typescript
moveNote(id: number, destinationFolderId: number): Promise<void>
```

| 引数 | 型 | 説明 |
|---|---|---|
| id | `number` | 移動するメモのID |
| destinationFolderId | `number` | 移動先フォルダのID（H-1決定：メモはルート直下に置けない） |

```sql
UPDATE NOTE SET folder_id = ?, updated_at = ? WHERE id = ?;
```
