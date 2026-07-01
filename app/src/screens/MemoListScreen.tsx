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