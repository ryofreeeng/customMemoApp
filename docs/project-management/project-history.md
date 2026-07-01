# プロジェクト進行履歴

各フェーズで何をしたかの記録。詳細は各成果物ファイルを参照。

---

## 現在地と次のアクション

> このセクションは作業のたびに更新する。完了したら打ち消し線か削除。

**現在のフェーズ：詳細設計（第1サイクル）**

### 残タスク

- [ ] 型定義一覧を作成 → `docs/detailed-design/type-definitions.md`
  - [x] 4カテゴリの方針決定（DBエンティティ型・Props型・UI状態型・ナビゲーション型）
  - [x] ナビゲーション型 決定済み
  - [x] UI状態型 決定済み
  - [ ] Props型 **途中（NoteCardPropsまで完了。FolderCard・MemoListScreen・MoveDestination系が残り）**
  - [ ] DBエンティティ型（db-access-functions.mdからの流用）
- [ ] `docs/detailed-design/` フォルダをgitコミット
- [ ] コンポーネント設計書を作成 → `docs/detailed-design/component-design.md`（**React基礎学習が先**）

### 完了済み（詳細設計フェーズ内）

- [x] DBアクセス関数一覧 → `docs/detailed-design/db-access-functions.md`

---

## フェーズ1：コンセプト確立・要件定義

- ユーザー（発注者）＆Claude（受注者）のロールプレイ形式で進行
- 要望整理 → 機能要件・UX方針・技術選定・マネタイズ方針を確定
- 成果物：`docs/requirements/` 配下の4ファイル（requirements.md・screens.md・system-architecture.md・er-diagram.md）

---

## フェーズ2：基本設計（最低限）

- フォルダ構成を `docs/requirements/` と `docs/basic-design/` に分離して再編
- 画面設計2画面（memo-list・move-destination）、テーブル定義書、状態遷移図、シーケンス図を作成
- 残り8画面は作成せず、アジャイル方針（詳細設計→開発→動作確認を先に回す）に切り替え

---

## フェーズ3：設計レビュー・課題管理（2026-06-25）

- `design-doc-reviewer` サブエージェントが要件定義書・基本設計書をレビュー
- 課題7件（H-1〜H-4、M-1〜M-2、L-1）を `issues.md` に起票
- 同日中に全課題の方針を議論・決定（詳細は `issues.md` 参照）
- memo-list の画面設計書にタグ表示仕様を追記

---

<!-- 以降、工程が進むたびに同じ形式で追記する -->
