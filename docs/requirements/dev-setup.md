# 開発環境セットアップ手順

このプロジェクト（React Native × Expo × SQLite）を動かすための環境構築手順。今わかる範囲で記載し、実装フェーズで随時更新する。

## 1. 前提条件（インストールが必要なもの）

| ツール | 用途 | 入手先 |
|---|---|---|
| Node.js（LTS版） | Expoの実行基盤 | https://nodejs.org |
| Xcode（Mac限定） | iOSシミュレーターの実行 | Mac App Store |
| DB Browser for SQLite | 開発中のDBの中身を目視確認・直接編集 | https://sqlitebrowser.org |

- Android エミュレーターが必要な場合は Android Studio も必要（最初はiOS優先で進める）
- 実機（iPhone）で確認する場合は **Expo Go**アプリ（App Storeで無料入手）があれば十分（Xcodeなしでも動く）

## 2. プロジェクトの初期化（初回のみ）

```bash
# TypeScriptテンプレートでExpoプロジェクトを作成
npx create-expo-app customMemoApp --template blank-typescript

cd customMemoApp
```

※このリポジトリをcloneした場合は初期化不要。`npm install` だけ実行すればよい。

## 3. 開発サーバーの起動

```bash
npx expo start
```

起動するとQRコードが表示される。

| 確認方法 | 操作 |
|---|---|
| iOSシミュレーター | ターミナルで `i` を押す（Xcodeが必要） |
| 実機（iPhone） | Expo Goアプリでカメラを起動してQRコードを読む |
| Androidエミュレーター | ターミナルで `a` を押す（Android Studioが必要） |

## 4. SQLiteデータベースの確認方法

### DBファイルのパスを取得する

SQLiteのDBファイルはシミュレーター（または実機）のアプリサンドボックス内に保存される。パスはアプリ起動時にコードで取得できる。

開発用のデバッグコードとして以下を仕込んでおくと、Metro（開発サーバーのターミナル）にパスが出力される：

```ts
import * as FileSystem from 'expo-file-system';
console.log('DB path:', FileSystem.documentDirectory);
```

### DB Browser for SQLite で開く

1. 上記のパスをコピーしてFinderで開く（`⌘+Shift+G` でパス入力できる）
2. そのフォルダ内の `.db` ファイルを DB Browser for SQLite にドラッグ&ドロップ
3. テーブルの中身を見たり、SQLを直接叩いたりできる

⚠️ DB Browser でファイルを開いている間はアプリ側からのDBアクセスと競合する可能性があるため、確認が終わったら閉じる。

## 5. 開発中のDBリセット方法

テーブル構造を変えたいとき（リリース前・自分だけが使っている段階）は、**アプリをシミュレーターからアンインストールして再インストール**するだけでDBがまっさらになる。

```
シミュレーター上でアプリを長押し → 削除 → npx expo start でアプリを再起動
```

※リリース後（実ユーザーがいる状態）でテーブル構造を変えたい場合はマイグレーションが必要（`docs/requirements/requirements.md` 10章参照）。

## 6. Dockerを使わない理由（決定事項）

このプロジェクトでは開発環境にDockerコンテナを使わない。理由は以下の通り：

- iOSシミュレーターはXcode経由でmacOS上でしか動かせない。DockerコンテナはLinux環境のため、コンテナ内からiOSシミュレーターを起動できない
- Metro bundler（Expoの開発サーバー）をコンテナ内で動かしても、シミュレーターは結局ホストMac上で動かす必要があり、ネットワーク疎通の設定が複雑になる
- 個人開発・Mac1台の構成では「開発環境の差異を統一する」というDockerの主なメリットが得られない

→ MacにNode.jsを直接インストールして開発する方式（本ドキュメントの手順）を採用する。

## 7. 今後追加予定の手順（実装フェーズで記載する）

- `expo-sqlite` のインストールと初期設定コード
- マイグレーション管理の具体的な実装方法（expo-sqlite SDK 50以降の `useMigrations` を使う予定）
- EAS Build / EAS Submit によるビルド・ストア提出手順
