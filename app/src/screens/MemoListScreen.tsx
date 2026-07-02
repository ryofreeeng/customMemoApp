import { View, Text, FlatList, StyleSheet } from 'react-native';

import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';


// DBから取り出す1行のデータ型
type Note = {
  id: number;
  title: string;
  updated_at: string;
};

// メモ一覧画面
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


/*
const mockNotes = [
  { id: 1, title: 'メモ1', updated_at: '2026-06-30' },
  { id: 2, title: 'メモ2', updated_at: '2026-06-29' },
  { id: 3, title: 'メモ3', updated_at: '2026-06-28' },
];
*/

/*
export function MemoListScreen2() {
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
*/


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
  title: { fontSize: 16 , color: 'rgb(111,11,111)'},
  date: { fontSize: 12, color: '#888' },
});