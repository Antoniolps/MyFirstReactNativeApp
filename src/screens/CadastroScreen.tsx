import { Alert, StyleSheet, View } from 'react-native'
import { useState } from 'react'
import { Button, Text, TextInput } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import { db, auth } from '../firebase/config'
import { createUserWithEmailAndPassword, signOut as firebaseSignOut, signOut } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

const CadastroScreen = () => {
    const [role, setRole] = useState<'garcom' | 'cozinha'>('garcom')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')

    const clearFields = () => {
        setRole('garcom')
        setEmail('')
        setSenha('')
        setConfirmarSenha('')
    }

    const handleCadastro = async () => {
        if (senha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem')
            return
        }
        
        try {
            const usuarioCriado = await createUserWithEmailAndPassword(auth, email, senha)

            await setDoc(doc(db, 'users', usuarioCriado.user.uid), {
                email,
                role,
                createdAt: serverTimestamp(),
            })

            Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!')
            clearFields()

            await firebaseSignOut(auth)
            
        } catch (error) {
            Alert.alert('Erro', 'Erro ao cadastrar usuário. Verifique os dados e tente novamente.')
            return
        }
    }

    return (
        <View style={styles.container}>
            <Text variant='titleLarge'>Cadastro de Usuário</Text>
            <Text style={styles.pickerLabel}>Você é:</Text>
            <Picker
                selectedValue={role}
                onValueChange={v => setRole(v as any)}
                style={styles.picker}
            >
                <Picker.Item label="Garçom" value="garcom" />
                <Picker.Item label="Cozinha" value="cozinha" />
            </Picker>
            <TextInput
                label='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                style={styles.input}
                mode='outlined'
            />
            <TextInput
                label='Senha'
                value={senha}
                onChangeText={setSenha}
                style={styles.input}
                secureTextEntry
                mode='outlined'
            />
            <TextInput
                label='Confirmar Senha'
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                style={styles.input}
                secureTextEntry
                mode='outlined'
            />
            <Button
                mode='contained'
                onPress={() => handleCadastro()}
                style={styles.button}
            >
                <Text style={{ color: 'white' }}>Cadastrar</Text>
            </Button>
        </View>
    )
}

export default CadastroScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 20,
        marginTop: 50,
    },
    pickerLabel: {
        marginTop: 16,
        fontSize: 14
    },
    picker: {
        marginBottom: 20,
    },
    input: {
        width: '100%',
        marginBottom: 10,
        
    },
    button: {
        width: '100%',
        backgroundColor: '#e96707',
        marginTop: 20,
    },

})