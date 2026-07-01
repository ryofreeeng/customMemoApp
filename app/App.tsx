import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MemoListScreen from './src/screens/MemoListScreen';

export default function App() {
  return (
    <View style={styles.container}>      
      <MemoListScreen></MemoListScreen>      
    </View>
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
