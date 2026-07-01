# 型定義一覧

対象サイクル：第1サイクル（メモ一覧・新規作成・移動先選択）

---

## 1. DBエンティティ型

DB の1行を表す型定義。SQLite の列名に合わせてプロパティ名はスネークケース（`parent_id` 等）で統一する。

```typescript
/** FOLDERテーブルの1行 */
interface Folder {
  id: number;
  name: string;
  parent_id: number | null;   // NULLはルート直下
  deleted_at: string | null;  // NULLは通常、値があればゴミ箱（ISO8601）
  created_at: string;
  updated_at: string;
}

/** NOTEテーブルの1行 */
interface Note {
  id: number;
  title: string;
  folder_id: number | null;   // NULLはルート直下
  deleted_at: string | null;  // NULLは通常、値があればゴミ箱（ISO8601）
  created_at: string;
  updated_at: string;
}
```

> db-access-functions.md にも同じ定義を記載している（関数の引数・戻り値の参照用）。正規の定義はこのファイル。

---

## 2. Props 型

> ※ コンポーネント設計書と合わせて後続で定義予定

---

## 3. UI 状態型

画面のモード（表示の切り替え）を表す型定義。

```typescript
/** メモ一覧画面のモード */
type MemoListMode = 'normal' | 'selecting' | 'creating';
```

| 値 | 意味 |
|---|---|
| `normal` | 通常の一覧表示 |
| `selecting` | 複数選択モード（チェックボックス表示・下部アクションバー出現） |
| `creating` | 新規作成フォーム表示中 |

### 補足

- **移動先選択画面** はモード切り替えがないため UI 状態型を定義しない
- **スワイプによるアクションボタン表示**はカードコンポーネント個別の状態であり、画面レベルの状態型とは別管理

---

## 4. ナビゲーション型

画面遷移時に各画面へ渡すパラメータの型定義。  
React Navigation の慣習に従い `type` で定義する。

```typescript
/** 移動対象の1件を表す型。メモとフォルダのどちらかになる */
type MoveSource =
  | { type: 'note';   id: number }
  | { type: 'folder'; id: number };

type RootStackParamList = {
  /** メモ一覧画面：表示するフォルダを指定する */
  MemoList: { folderId: number };

  /**
   * 移動先選択画面
   * - folderId : ピッカー内で現在表示中のフォルダID
   * - sources  : 移動対象のリスト（1件でも複数件でも同じ型で表現）
   */
  MoveDestination: {
    folderId: number;
    sources: MoveSource[];
  };
};
```

### 補足

| 画面 | パラメータ | 備考 |
|---|---|---|
| MemoList | `folderId` 必須 | アプリ起動時はルートフォルダ（folderId=1）を渡す |
| 新規作成フォーム | 定義不要 | MemoList 内の UI 状態型で管理するため、独立した画面ではない |

### 将来追加予定の画面（第2サイクル以降）

```typescript
// 第2サイクル以降に追記予定
// MemoDetail: { noteId: number };
// MemoEdit: { noteId: number };
// Settings: undefined;
// TagList: undefined;
// ...
```
