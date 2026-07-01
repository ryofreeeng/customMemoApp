# コンポーネント設計書（第1サイクル：メモ一覧画面）

対象サイクル：第1サイクル中の**メモ一覧画面のみ**。新規作成・移動先選択画面は別途作成予定。

- 画面設計書：[docs/basic-design/screens/memo-list.md](../basic-design/screens/memo-list.md)
- 型定義一覧：[type-definitions.md](./type-definitions.md)
- DBアクセス関数一覧：[db-access-functions.md](./db-access-functions.md)

---

## 1. コンポーネントツリー

```
MemoListScreen（画面全体）
├─ Header（＜戻る・フォルダ名・⚙設定）
├─ ItemList（FlatList。フォルダ＋メモを1本の配列にまとめて連続表示）
│   ├─ FolderCard（×N、フォルダ1件）
│   │   └─ SwipeableRow（共通部品：左スワイプ・タグタブ表示）
│   └─ NoteCard（×N、メモ1件）
│       └─ SwipeableRow（共通部品。FolderCardと共有）
└─ BottomBar（＋新規作成・🔍検索・☑選択／選択モード中は移動・削除に切替）
```

`ItemList`に渡す配列は、`getFolderContents`が返す`{ folders, notes }`を`[...folders, ...notes]`の形で連結したもの。SQL側で既にフォルダは五十音順・メモは更新日順にソート済みのため、連結するだけで正しい並び順になる（詳細は[補足1](#補足1スクロールを統一するためフォルダメモを1本のflatlistにまとめる)）。

`FolderCard`と`NoteCard`は別コンポーネントだが、スワイプ・タグ表示という共通の見た目部分は`SwipeableRow`という共通の子コンポーネントとして1つに集約する（継承ではなく「包む」設計。詳細は[補足4](#補足4folder用note用を1つのコンポーネントにすべきか継承すべきか)）。

---

## 2. 各コンポーネントの詳細

### MemoListScreen

| props | 型 | 意味 |
|---|---|---|
| `folderId` | `number` | 表示するフォルダのID。ナビゲーション型（`RootStackParamList`の`MemoList`）から渡される |

| state | 型 | 意味 |
|---|---|---|
| `mode` | `MemoListMode`（`'normal' \| 'selecting' \| 'creating'`） | 画面の表示モード。UI状態型そのもの（[補足3](#補足3ui状態型はどこで扱うか)） |
| `items` | `(Folder \| Note)[]` | フォルダ＋メモを連結した、画面に表示する一覧データ |
| `selectedIds` | `Set<number>` | 複数選択モード中に選択されているフォルダ・メモのID集合（[補足2](#補足2isselectedは誰が持つか)） |

| ローカル関数 | 呼び出し元（どのprops経由か） | 処理の概要 |
|---|---|---|
| `handleBack` | Header（`onBack`） | 1つ上の親フォルダに戻る |
| `handleSettingsPress` | Header（`onSettingsPress`） | 設定画面に遷移 |
| `handleItemPress(item)` | ItemList（`onItemPress`） | フォルダなら中に入る・メモなら詳細画面へ遷移 |
| `handleToggleSelect(id)` | ItemList（`onToggleSelect`） | `selectedIds`へのID追加/削除を切り替え |
| `handleMoveItem(item)` | ItemList（`onMovePress`） | 移動先選択画面へ遷移 |
| `handleDeleteItem(item)` | ItemList（`onDeletePress`） | ゴミ箱に移動（DB更新→`items`再取得） |
| `handleCreatePress` | BottomBar（`onCreatePress`） | `mode`を`'creating'`に切り替え |
| `handleSearchPress` | BottomBar（`onSearchPress`） | 検索画面に遷移 |
| `handleSelectTogglePress` | BottomBar（`onSelectTogglePress`） | `mode`を`'normal'`↔`'selecting'`に切り替え |
| `handleBulkMove` | BottomBar（`onMovePress`・選択中） | `selectedIds`の全アイテムを移動先選択画面へ |
| `handleBulkDelete` | BottomBar（`onDeletePress`・選択中） | `selectedIds`の全アイテムをゴミ箱に移動 |

> ローカル関数はpropsでもstateでもなく、このコンポーネントの中だけで定義・使用する関数。子コンポーネント（Header・ItemList・BottomBar）のpropsにコールバックとして渡す。

役割：`folderId`をもとにDBからフォルダ・メモを取得して`items`にまとめる、ヘッダー・リスト・下部バーの3つを組み立てる、モードの切り替えを管理する、各操作（戻る・移動・削除等）のハンドラを定義して子コンポーネントに渡す。

### Header

| props | 型 | 意味 |
|---|---|---|
| `folderName` | `string \| null` | 表示中フォルダの名前。ルートフォルダの場合は`null`（非表示） |
| `mode` | `MemoListMode` | 現在のモード。`'creating'`のときは戻るボタン・設定ボタンを無効化する用途で使う |
| `onBack` | `() => void` | ＜戻るタップ時に呼ばれる |
| `onSettingsPress` | `() => void` | ⚙設定タップ時に呼ばれる |

state：なし（「今、作成中かどうか」の判断はMemoListScreenの`mode`がすでに持っており、Headerはそれをpropsとして受け取るだけ。Headerが独自にstateとして持つと、画面レベルの`mode`と二重管理になってしまうため）

役割：戻るボタン・フォルダ名・設定ボタンを表示する。`mode === 'creating'`のときはボタンを無効化する。タップされたら自分では何もせず、propsで受け取ったコールバックを呼ぶだけ。

### ItemList

| props | 型 | 意味 |
|---|---|---|
| `items` | `(Folder \| Note)[]` | 表示する一覧データ |
| `mode` | `MemoListMode` | 現在のモード（選択モード中はチェックボックス表示に切り替えるため） |
| `selectedIds` | `Set<number>` | 選択中のID集合。各行に「自分は選択されているか」を渡すために使う |
| `onItemPress` | `(item: Folder \| Note) => void` | 行タップ時に呼ばれる（通常モード時：フォルダなら遷移、メモなら詳細へ） |
| `onToggleSelect` | `(id: number) => void` | 選択モード時、行タップで選択/解除する |
| `onMovePress` | `(item: Folder \| Note) => void` | スワイプの移動ボタン押下時。中でFolderCard/NoteCardに渡す（バケツリレー） |
| `onDeletePress` | `(item: Folder \| Note) => void` | スワイプの削除ボタン押下時。中でFolderCard/NoteCardに渡す（バケツリレー） |

state：なし（一覧の保持自体は`FlatList`という標準コンポーネントに任せるため、独自のstateは持たない）

役割：`items`の各要素がフォルダかメモかを判定し、`FolderCard`または`NoteCard`として描画する。各カードに対応するコールバックを組み立てて渡す。

### FolderCard / NoteCard

| props | 型 | 意味 |
|---|---|---|
| `folder`（NoteCardは`note`） | `Folder`（`Note`） | このカード1件分のデータ |
| `isSelected` | `boolean` | 自分が選択中かどうか（親の`selectedIds`から計算して渡される） |
| `mode` | `MemoListMode` | チェックボックス表示の要否を判断するために必要 |
| `onPress` | `() => void` | タップ時 |
| `onLongPress` | `() => void` | 長押し時（操作メニュー表示） |
| `onToggleSelect` | `() => void` | 選択モード時のタップ |
| `onMovePress` | `() => void` | スワイプで出てくる「移動」ボタン押下時 |
| `onDeletePress` | `() => void` | スワイプで出てくる「削除」ボタン押下時 |

state：なし（自分専用の状態は持たず、見た目はすべて`SwipeableRow`に委ねる）

役割：アイコン・名前（フォルダ）またはタイトル（メモ）を表示する。実際のスワイプ・タグ表示は中の`SwipeableRow`が行う。

### SwipeableRow（共通部品）

| props | 型 | 意味 |
|---|---|---|
| `children` | コンポーネント | 中央に表示する内容（FolderCard/NoteCardの中身） |
| `tags` | `Tag[]` | 上部に表示するタグタブ用のデータ |
| `onMovePress` | `() => void` | 移動ボタン押下時 |
| `onDeletePress` | `() => void` | 削除ボタン押下時 |

| state | 型 | 意味 |
|---|---|---|
| `swipeDirection` | `'none' \| 'left'` | 左スワイプで移動・削除ボタンが出ている状態かどうか。**このコンポーネント単体だけが持つ、オリジナルの状態**（[補足2](#補足2isselectedは誰が持つか)で触れた「他に影響しない状態」の例） |

役割：左スワイプのジェスチャーを検知してボタンを表示する、タグタブを表示する。

> 右スワイプ（ピン留め）は拡張フェーズの機能のため、今回のv1設計には含めない。

### BottomBar

| props | 型 | 意味 |
|---|---|---|
| `mode` | `MemoListMode` | 通常時は「新規作成・検索・選択」、選択モード時は「移動・削除・選択」を出し分けるために使う |
| `onCreatePress` | `() => void` | ＋新規作成タップ時 |
| `onSearchPress` | `() => void` | 🔍検索タップ時 |
| `onSelectTogglePress` | `() => void` | ☑選択タップ時（モードのON/OFF切り替え） |
| `onMovePress` | `() => void` | 選択モード中の「移動」タップ時 |
| `onDeletePress` | `() => void` | 選択モード中の「削除」タップ時 |

state：なし

役割：`mode`に応じて表示するボタンの組み合わせを切り替える。

---

## 補足（検討事項への回答）

### 補足1：スクロールを統一するため、フォルダ・メモを1本のFlatListにまとめる

`FlatList`は表示中の項目だけを描画する「仮想化リスト」のため、2つの`FlatList`を並べる、または入れ子にすると、それぞれが別々のスクロール領域を持ってしまい、1つの連続したスクロールにならない（パフォーマンス上の問題も起きやすい）。

`getFolderContents`が返す`{ folders, notes }`を`[...folders, ...notes]`として1本の配列に連結し、1つの`FlatList`に渡すことで解決する。SQLで既にフォルダは五十音順・メモは更新日順にソート済みのため、連結するだけで画面設計書通りの並び順になる。

### 補足2：isSelectedは誰が持つか

複数選択時の「選択されているか」は、選択された1件のカードだけでなく、画面下部のバー（移動・削除ボタンへの切り替え）にも影響する。1枚のカードだけが独自に持つstateにしてしまうと、画面側が「今何件選択されているか」を把握できない。

そのため、選択中のID一覧（`selectedIds`）は**両方に影響を与える共通の親（`MemoListScreen`）が持ち**、各カードには「自分のIDが`selectedIds`に含まれているか」を計算した結果を`isSelected`としてpropsで渡す。これは「stateを持ち上げる（lifting state up）」と呼ばれる設計パターン。

一方、`SwipeableRow`の`swipeDirection`（スワイプ状態）は、他のどのコンポーネントにも影響しない、その行だけで完結する見た目の状態なので、そのコンポーネント自身のstateとして問題ない。

### 補足3：UI状態型はどこで扱うか

`MemoListScreen`のstateに持たせた`mode: MemoListMode`が、型定義一覧のUI状態型そのものに対応する。

UI状態型は画面内の複数コンポーネント（リストの表示・下部バーのボタン）に影響するため、補足2と同じ理由で、画面全体を囲うコンポーネントがstateとして持つ。

### 補足4：Folder用・Note用を1つのコンポーネントにすべきか、継承すべきか

Reactにはクラスの継承という仕組みがなく、共通部分は「継承」ではなく「**包む（コンポジション）**」で表現する。

今回はフォルダ・メモで共通する見た目（スワイプ・タグ表示）を`SwipeableRow`という共通の子コンポーネントに切り出し、`FolderCard`・`NoteCard`はそれぞれ中身（アイコン・タイトル等）と振る舞い（タップ時の遷移先など）だけを持つ形にした。

### 補足5（未確定・要確認）：複数選択モードの実装範囲

[memo-list.md](../basic-design/screens/memo-list.md)によると、☑選択ボタンは「v1ではUI配置のみ・タップ未対応（拡張フェーズで機能実装）」となっている。

本設計書では型定義一覧の`MemoListMode`に合わせて`selectedIds`等まで設計に含めているが、**v1では本当にここまで作り込むべきか、それともボタンの見た目だけ用意して機能は拡張フェーズに回すか**は未確認。次回の認識合わせで決定する。
