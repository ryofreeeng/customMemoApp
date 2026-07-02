# 実装作業手順書

このファイルは実装フェーズの進捗と手順を記録する。  
質問のたびに随時更新する。

---

## 現在のサイクル：第1サイクル最小実装

**目標：** メモ一覧画面でハードコードデータをリスト表示する  
**スコープ外（後回し）：** SQLite接続・スワイプ・長押し・選択・タグ・画面遷移

---

## 進捗チェックリスト

- [ ] STEP 1: Node.js の確認・インストール
- [ ] STEP 2: プロジェクト初期化（Expoプロジェクトをルートフォルダに展開）
- [ ] STEP 3: 起動確認（雛形のまま Expo Go で表示できるか）
- [ ] STEP 4: ファイル構成整理（`src/screens/` フォルダを作る）
- [ ] STEP 5: MemoListScreen.tsx を作成（ハードコードデータで一覧表示）
- [ ] STEP 6: App.tsx から MemoListScreen を呼び出す
- [ ] STEP 7: 実機または Expo Go で動作確認

---

## STEP 1: Node.js の確認・インストール

ターミナルで以下を実行して、バージョン番号が出れば OK。

```bash
node --version
npm --version
```

> `--version` は「バージョンを表示して終了する」という意味のオプション。  
> `-v` と短縮して書いても同じ（`node -v`）。多くのCLIツールで共通の慣習。

### バージョンが出なかった場合（インストール方法）

**方法A：コマンドで入れる（Mac推奨）**

Mac には **Homebrew**（macOS用パッケージマネージャー）を使うのが主流。  
Pythonでいう `pip` の Mac 全体版のようなもの。

```bash
# Homebrew 自体がインストール済みか確認
brew --version
```

Homebrew が入っていれば：

```bash
brew install node
```

Homebrew がまだ入っていない場合は [brew.sh](https://brew.sh) を開くとインストールコマンドが表示される。

**方法B：インストーラーを使う**

[nodejs.org](https://nodejs.org) から **LTS版** の `.pkg` ファイルをダウンロードして実行。  
（LTS = Long Term Support = 長期サポート版。安定版という意味）

---

## STEP 2: プロジェクト初期化

**重要：** `customMemoApp/` ルートフォルダの中で実行する。  
`.claude` フォルダ等が上書きされないよう、`app` という名前のサブフォルダを作ってその中に展開する。

```bash
# customMemoApp/ の中から実行
npx create-expo-app app --template blank-typescript
```

**コマンドの各部分の意味：**

| 部分 | 意味 |
|---|---|
| `npx` | npm に付属するコマンド実行ツール。「パッケージをインストールせずにそのまま実行する」。Pythonでいう `python -m` に近い |
| `create-expo-app` | Expo が公式提供しているプロジェクト生成ツールの名前 |
| `app` | 作成するフォルダ名。この名前のサブフォルダが作られ、その中にExpoのファイルが展開される |
| `--template` | 雛形の種類を選ぶオプション。`--template 〇〇` の形で使う |
| `blank-typescript` | `--template` に渡す値。「空のTypeScript雛形」という意味。他にもnavigation付きの雛形等があるが今回は最小構成を選ぶ |

> **`npx` と `npm` の違い（混同しやすい）**  
> - `npm`：パッケージを**インストールして保存する**ツール（`npm install react-native` など）  
> - `npx`：パッケージをインストールせず**その場で実行するだけ**のツール  
> `create-expo-app` は1回だけ使うセットアップツールなので、インストールせず `npx` で直接実行するのが主流。

実行後のフォルダ構成イメージ：

```
customMemoApp/
├── .claude/            ← 既存（Claude のメモリ。上書きされない）
├── docs/               ← 既存（設計書類）
├── samples/            ← 既存
└── app/                ← create-expo-app が新規作成
    ├── App.tsx
    ├── package.json
    ├── tsconfig.json
    └── ...（その他の雛形ファイル）
```

以降の作業（STEP 3〜）は `app/` フォルダの中で行う。

---

## STEP 3: 起動確認

```bash
npx expo start
```

> `expo start` は「Expo の開発サーバー（Metro Bundler）を起動する」コマンド。  
> `npx` で実行する理由は STEP 2 と同じ（グローバルインストールなしで実行できる）。

QRコードが表示される。スマートフォンの **Expo Go** アプリ（App Storeで無料）でカメラを起動してQRコードを読むと実機で確認できる。  
（PCとスマホが同じ Wi-Fi に繋がっている必要がある）

雛形の画面が表示されれば STEP 3 完了。

---

## STEP 4: ファイル構成整理

以下のフォルダ・ファイルを手動で作成する。

```
app/
└── src/
    └── screens/
        └── MemoListScreen.tsx   ← 新規作成（中身はSTEP 5で書く）
```

`App.tsx` はこの時点では何も変えない。

---

## STEP 5: MemoListScreen.tsx を作成

`app/src/screens/MemoListScreen.tsx` に以下を書く。  
この時点では DB は使わず、ハードコードした仮データを表示するだけ。

```tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';

const mockNotes = [
  { id: 1, title: 'メモ1', updated_at: '2026-06-30' },
  { id: 2, title: 'メモ2', updated_at: '2026-06-29' },
  { id: 3, title: 'メモ3', updated_at: '2026-06-28' },
];

export default function MemoListScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockNotes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.updated_at}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
  title: { fontSize: 16 },
  date: { fontSize: 12, color: '#888' },
});
```

**使っているもの（初出の場合はここで調べるとよい）：**
| 名前 | 何者か |
|---|---|
| `View` | React Native の「箱」。HTMLの `<div>` 相当 |
| `Text` | React Native の「テキスト表示」。HTMLの `<p>` 相当 |
| `FlatList` | 長いリストを効率よく表示する専用コンポーネント |
| `StyleSheet.create()` | スタイルを定義する。CSSのオブジェクト版 |
| `export default` | このファイルの「主役」をエクスポートする宣言（App.tsx で読み込むため） |

---

## STEP 6: App.tsx から MemoListScreen を呼び出す

`App.tsx` を開いて中身をまるごと以下に差し替える。

```tsx
import MemoListScreen from './src/screens/MemoListScreen';

export default function App() {
  return <MemoListScreen />;
}
```

---

## STEP 7: 動作確認

`npx expo start` が停止していれば再起動する。  
Expo Go でアプリを開き直すと、メモ一覧が表示されれば完了。

---

## 次のサイクル以降（未着手）

- React Navigation の導入（画面遷移）
- フォルダ選択・タグ・スワイプ等（詳細設計書の残機能）

---

## 第2サイクル：SQLite 導入とDBデータ表示

**目標：** ハードコードデータをやめ、SQLite に保存した実データを一覧画面に表示する  
**スコープ外（後回し）：** メモの追加・編集・削除、画面遷移

---

## 進捗チェックリスト（第2サイクル）

- [ ] STEP 8: `expo-sqlite` のインストール
- [ ] STEP 9: DBマイグレーション関数を作成（`src/db/database.ts`）
- [ ] STEP 10: `App.tsx` に `SQLiteProvider` を追加
- [ ] STEP 11: `MemoListScreen.tsx` をDB読み込みに切り替える
- [ ] STEP 12: 動作確認

---

## STEP 8: `expo-sqlite` のインストール

`app/` フォルダの中で以下を実行する。

```bash
npx expo install expo-sqlite
```

> **`npm install` ではなく `npx expo install` を使う理由**  
> Expo では `npx expo install` を使うと、現在の Expo SDK バージョン（今は v54）と互換性のある `expo-sqlite` のバージョンを自動で選んでくれる。  
> `npm install expo-sqlite` でも動くが、バージョン不一致でエラーになりやすい。  
> Expo のパッケージは基本的に `npx expo install` で入れるのが安全。

インストール後、`app/package.json` の `dependencies` に `expo-sqlite` が追加されていれば OK。

---

## STEP 9: DBマイグレーション関数を作成

### ファイル構成の追加

以下のファイルを新規作成する。

```
app/src/
├── db/
│   └── database.ts   ← 新規作成（DB初期化・テーブル作成を担当）
└── screens/
    └── MemoListScreen.tsx   ← 後のSTEPで編集する
```

### `src/db/database.ts` の中身

```typescript
import { SQLiteDatabase } from 'expo-sqlite';

// DBのバージョン番号（スキーマを変えるたびに +1 する）
const DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // 現在のDBバージョンを取得
  const { user_version: currentVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );

  // すでに最新バージョンなら何もしない
  if (currentVersion >= DATABASE_VERSION) return;

  // バージョン0（初回起動）の場合にテーブルを作成する
  if (currentVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS notes (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        title      TEXT    NOT NULL,
        content    TEXT,
        updated_at TEXT    DEFAULT (datetime('now', 'localtime'))
      );
    `);

    // 表示確認用のサンプルデータを挿入
    await db.runAsync("INSERT INTO notes (title) VALUES (?)", 'サンプルメモ1');
    await db.runAsync("INSERT INTO notes (title) VALUES (?)", 'サンプルメモ2');
    await db.runAsync("INSERT INTO notes (title) VALUES (?)", 'サンプルメモ3');
  }

  // バージョン番号を更新して次回起動時にスキップされるようにする
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
```

**用語・概念の補足：**

| 用語 | 意味 |
|---|---|
| マイグレーション | DBのスキーマ（構造）をバージョン管理する仕組み。Pythonの `alembic` に近い |
| `PRAGMA user_version` | SQLite が持つ「このDBの今のバージョン番号」を読み書きするための特殊命令 |
| `PRAGMA journal_mode = 'wal'` | 書き込みの方式を変える設定。読み書きが同時に起きても壊れにくくなる。おまじないとして入れておく |
| `execAsync` | 複数のSQL文をまとめて実行する。結果を受け取る必要がないとき使う |
| `runAsync` | 1文のSQL（INSERTやUPDATEなど）を実行する。`?` にパラメータを安全に埋め込める |

> 他にも `drizzle-orm` 等のORMを使ってマイグレーションを管理する方式があるが、ここでは `expo-sqlite` の組み込み機能に絞って説明した。

---

## STEP 10: `App.tsx` に `SQLiteProvider` を追加

`app/App.tsx` をまるごと以下に書き換える。

```tsx
import { Suspense } from 'react';
import { View, Text } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import MemoListScreen from './src/screens/MemoListScreen';
import { migrateDbIfNeeded } from './src/db/database';

export default function App() {
  return (
    <Suspense fallback={<View><Text>DB読み込み中...</Text></View>}>
      <SQLiteProvider databaseName="memo.db" onInit={migrateDbIfNeeded} useSuspense>
        <MemoListScreen />
      </SQLiteProvider>
    </Suspense>
  );
}
```

**構造の読み方：**

```
App
└── Suspense（DB準備中はローディング表示）
    └── SQLiteProvider（DB接続を管理・子コンポーネントに供給）
        └── MemoListScreen（DBを使う画面）
```

| 部分 | 意味 |
|---|---|
| `SQLiteProvider` | DBの接続を開いて、子コンポーネント全体に「使えるよ」と渡す入れ物。C#でいう依存注入コンテナに近い |
| `databaseName="memo.db"` | 端末に保存するDBファイルの名前 |
| `onInit={migrateDbIfNeeded}` | 初回起動時（DBが存在しないとき）にSTEP9の関数を自動で呼ぶ設定 |
| `useSuspense` | DB準備が終わるまで子コンポーネントを表示しないようにするオプション |
| `Suspense` | React の仕組み。`useSuspense` と組み合わせて「準備中はローディングを表示、終わったら子を表示」にする |

---

## STEP 11: `MemoListScreen.tsx` をDB読み込みに切り替える

`app/src/screens/MemoListScreen.tsx` をまるごと以下に書き換える。

```tsx
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// DBから取り出す1行のデータ型
type Note = {
  id: number;
  title: string;
  updated_at: string;
};

export default function MemoListScreen() {
  const db = useSQLiteContext();           // SQLiteProvider が渡したDB接続を受け取る
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    async function loadNotes() {
      const result = await db.getAllAsync<Note>(
        'SELECT id, title, updated_at FROM notes ORDER BY updated_at DESC'
      );
      setNotes(result);
    }
    loadNotes();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.updated_at}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
  title: { fontSize: 16 },
  date: { fontSize: 12, color: '#888' },
});
```

**第1サイクルからの変更点：**

| 変更前 | 変更後 | 理由 |
|---|---|---|
| `const mockNotes = [...]`（配列） | `const [notes, setNotes] = useState([])`（state） | 非同期でDB取得した結果を画面に反映するため |
| データなし | `useSQLiteContext()` | SQLiteProvider から DB接続を受け取るため |
| データなし | `useEffect` + `getAllAsync` | 画面表示時にDBから全件取得するため |

> `useSQLiteContext` は「SQLiteProvider の中にいるコンポーネントだけが使えるフック」。  
> Provider の外で呼ぶとエラーになる（STEP10 の構造が前提）。

---

## STEP 12: 動作確認

`npx expo start` を起動して Expo Go で確認する。

**確認ポイント：**

1. 「サンプルメモ1〜3」が一覧に表示される → DBからデータが読めている
2. アプリを再起動してもデータが残っている → ちゃんとファイルに保存されている
3. 初回以降はサンプルデータが重複して挿入されない → マイグレーションのバージョン管理が機能している

**うまく動かないときの確認ポイント：**

| 症状 | 確認箇所 |
|---|---|
| 真っ白 / 「DB読み込み中」のまま | `migrateDbIfNeeded` の中でエラーが出ていないか。ターミナルのログを確認 |
| `useSQLiteContext` エラー | `MemoListScreen` が `SQLiteProvider` の外に出ていないか `App.tsx` を確認 |
| データが表示されない | サンプルデータのINSERTが実行されたか。DBを一度削除（アプリをアンインストール）して再起動 |
