import { SQLiteDatabase } from 'expo-sqlite';

// DBのバージョン番号（スキーマを変えるたびに +1 する）
const DATABASE_VERSION = 1;

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // 現在のDBバージョンを取得
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result?.user_version ?? 0;

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