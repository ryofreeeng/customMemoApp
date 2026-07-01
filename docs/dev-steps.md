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
customMemoApp/
└── src/
    └── screens/
        └── MemoListScreen.tsx   ← 新規作成（中身はSTEP 5で書く）
```

`App.tsx` はこの時点では何も変えない。

---

## STEP 5: MemoListScreen.tsx を作成

`src/screens/MemoListScreen.tsx` に以下を書く。  
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

## 次のサイクル（未着手）

第1サイクル完了後に追加予定：

- SQLite 接続（`expo-sqlite` のインストールと初期設定）
- DB マイグレーション（初回起動時にテーブルを作成する処理）
- 実際のDBデータを表示する（ハードコードデータを廃止）
- React Navigation の導入（画面遷移）
- フォルダ選択・タグ・スワイプ等（詳細設計書の残機能）
