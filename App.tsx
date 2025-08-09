import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/Auth.Context';
import AppRoutes from './src/navigation';


export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </PaperProvider>
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
