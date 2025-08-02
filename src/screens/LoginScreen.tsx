import { StyleSheet, View, Image, Alert } from 'react-native'
import { useState } from 'react'
import { Button, Text, TextInput } from 'react-native-paper'
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const clearFields = () => {
    setEmail('')
    setSenha('')
  }

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Por favor, preencha todos os campos.')
      return
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
        Alert.alert('Sucesso', 'Login realizado com sucesso!')
        clearFields()
      })
      .catch((error) => {
        Alert.alert('Erro', 'Erro ao realizar login. Verifique suas credenciais.')
      })
  }

  return (
    <View style={styles.container}>
      {/* Logo do app */}
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text variant='titleLarge'>Login do Garçom</Text>
      <TextInput
        label='Email'
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        style={styles.input}
        mode='outlined'
        outlineColor='#e96707'
        activeOutlineColor='#e96707'
      />
      <TextInput
        label='Senha'
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
        mode='outlined'
        outlineColor='#e96707'
        activeOutlineColor='#e96707'
      />
      <Button
        mode='contained'
        onPress={handleLogin}
        style={styles.button}
      >
        <Text style={{ color: 'white' }}>Login</Text>
      </Button>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
    marginTop: 50,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#e96707',
    marginTop: 10,
  },
})