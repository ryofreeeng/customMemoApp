# テーブル定義書（第1サイクル）

第1サイクルで実装するFOLDERとNOTEテーブルの定義。PARAGRAPH・TAG・TAG_ASSIGNMENTは後のサイクルで追加する。

- ER図（論理レベル）：[docs/requirements/er-diagram.md](../requirements/er-diagram.md)
- 今後カラムを追加する場合はマイグレーション（migration_v2.sql等）として追加し、このファイルも更新する

---

## 共通仕様

| 項目 | 方針 |
|---|---|
| 日時の型 | TEXT（ISO8601形式: `"2024-01-15T10:30:00"`）。SQLiteにDATE型はなく、TEXTで保存すると文字列ソートが時系列ソートと一致するため |
| 真偽値の型 | INTEGER（0=false, 1=true）。SQLiteにBOOLEAN型はない |
| 削除の方針 | 物理削除なし。`deleted_at`にISO8601日時を入れることでゴミ箱扱い（ソフトデリート）。NULLなら通常、値があればゴミ箱。削除日時が記録に残るため将来の自動完全削除にも対応できる |
| 名前の重複 | 許容。IDで区別するためUNIQUE制約なし |
| ルート直下の表現 | `parent_id = NULL`（FOLDERの場合）または`folder_id = NULL`（NOTEの場合）でルート直下を表す |
| 外部キー制約の有効化 | SQLiteはデフォルトでFK制約が無効。アプリ起動時に`PRAGMA foreign_keys = ON`を実行して有効化する |

---

## FOLDERテーブル

フォルダを管理するテーブル。自己参照（`parent_id`）によって階層構造を表現する。

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 自動採番の一意ID |
| name | TEXT | NOT NULL | フォルダ名。重複許容 |
| parent_id | INTEGER | REFERENCES FOLDER(id) | 親フォルダのID。NULLはルート直下 |
| deleted_at | TEXT | | 削除日時（ISO8601）。NULLなら通常、値があればゴミ箱（ソフトデリート） |
| created_at | TEXT | NOT NULL | 作成日時（ISO8601） |
| updated_at | TEXT | NOT NULL | 最終更新日時（ISO8601）。名前変更・移動時に更新 |

```sql
CREATE TABLE FOLDER (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  parent_id  INTEGER REFERENCES FOLDER(id),
  deleted_at TEXT,
  created_at TEXT    NOT NULL,
  updated_at TEXT    NOT NULL
);
```

---

## NOTEテーブル

メモを管理するテーブル。`folder_id`で所属フォルダを指す。

| カラム名 | 型 | 制約 | 説明 |
|---|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 自動採番の一意ID |
| title | TEXT | NOT NULL | メモタイトル。重複許容 |
| folder_id | INTEGER | REFERENCES FOLDER(id) | 所属フォルダのID。NULLはルート直下 |
| deleted_at | TEXT | | 削除日時（ISO8601）。NULLなら通常、値があればゴミ箱（ソフトデリート） |
| created_at | TEXT | NOT NULL | 作成日時（ISO8601） |
| updated_at | TEXT | NOT NULL | 最終更新日時（ISO8601）。タイトル変更・移動・段落編集時に更新 |

```sql
CREATE TABLE NOTE (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT    NOT NULL,
  folder_id  INTEGER REFERENCES FOLDER(id),
  deleted_at TEXT,
  created_at TEXT    NOT NULL,
  updated_at TEXT    NOT NULL
);
```

---

## 第1サイクルで使う主なクエリ（参考）

実際のSQL文は実装時に詳細設計として定める。ここでは意図の確認用に記載する。

### メモ一覧の表示（ルート直下の場合）

```sql
-- フォルダ一覧（五十音順）
SELECT * FROM FOLDER
WHERE parent_id IS NULL AND deleted_at IS NULL
ORDER BY name ASC;

-- メモ一覧（最終更新日降順）
SELECT * FROM NOTE
WHERE folder_id IS NULL AND deleted_at IS NULL
ORDER BY updated_at DESC;
```

### フォルダ内の表示（folder_idが指定されている場合）

```sql
SELECT * FROM FOLDER
WHERE parent_id = ? AND deleted_at IS NULL
ORDER BY name ASC;

SELECT * FROM NOTE
WHERE folder_id = ? AND deleted_at IS NULL
ORDER BY updated_at DESC;
```

### 新規フォルダ作成

```sql
INSERT INTO FOLDER (name, parent_id, is_deleted, created_at, updated_at)
VALUES (?, ?, 0, ?, ?);
```

### 新規メモ作成

```sql
INSERT INTO NOTE (title, folder_id, is_deleted, created_at, updated_at)
VALUES (?, ?, 0, ?, ?);
```

### フォルダの移動

```sql
UPDATE FOLDER SET parent_id = ?, updated_at = ? WHERE id = ?;
```

### メモの移動

```sql
UPDATE NOTE SET folder_id = ?, updated_at = ? WHERE id = ?;
```

### ゴミ箱への移動（削除）

```sql
UPDATE FOLDER SET deleted_at = ?, updated_at = ? WHERE id = ?;
UPDATE NOTE   SET deleted_at = ?, updated_at = ? WHERE id = ?;
```

---

## 将来追加予定のカラム（参考）

拡張フェーズ以降でマイグレーションとして追加する予定のカラム。v1では存在しない。

| テーブル | カラム名 | 型 | 説明 |
|---|---|---|---|
| FOLDER | is_pinned | INTEGER | ピン留めフラグ（拡張フェーズ） |
| NOTE | is_pinned | INTEGER | ピン留めフラグ（拡張フェーズ） |
