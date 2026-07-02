import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MemoListScreen from './src/screens/MemoListScreen';

import { Suspense } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
