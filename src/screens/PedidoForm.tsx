import { StyleSheet, View, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import React, { useContext, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthContext } from "../contexts/Auth.Context";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

type FormRouterProp = RouteProp<RootStackParamList, 'NovoPedido'>;
type FormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NovoPedido'>;

const PedidoForm = () => {
    const route = useRoute<FormRouterProp>();
    const navigation = useNavigation<FormNavigationProp>();

    const [mesa, setMesa] = useState('');
    const [itens, setItens] = useState('');
    const [observacoes, setObservacoes] = useState('');

    const { user } = useContext(AuthContext);

    const handleEnviarPedido = async () => {
        if(!user) return;

        if(!mesa || !itens){
            Alert.alert('Erro', 'Mesa e Itens sãoobrigatórios.')
            return
        }

        try{
            await addDoc(collection(db, 'pedidos'), {
                mesa,
                itens,
                observacoes,
                criadoEm: serverTimestamp(),
                uid: user.uid,
                status: 'solicitado',
            });
            Alert.alert('Sucesso', 'Pedido solicitado com sucesso.');
            navigation.goBack();
        }
        catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar o pedido.')
        }

    }

    return (
       <View style={{ flex: 1, padding: 20 }}>
           <Text variant="titleLarge">Novo Pedido</Text>
           <TextInput
               label='Mesa'
               value={mesa}
               onChangeText={setMesa}
               style={styles.input}
               mode='outlined'
               outlineColor='#e96707'
               activeOutlineColor='#e96707'
           />
           <TextInput
               label='Itens'
               value={itens}
               onChangeText={setItens}
               style={styles.input}
               mode='outlined'
               outlineColor='#e96707'
               activeOutlineColor='#e96707'
           />
           <TextInput
               label='Observações'
               value={observacoes}
               onChangeText={setObservacoes}
               style={styles.input}
               mode='outlined'
               outlineColor='#e96707'
               activeOutlineColor='#e96707'
           />

           <Button mode="contained" style={styles.button} onPress={handleEnviarPedido}>
               Solicitar
           </Button>
       </View>
    );
};

export default PedidoForm;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#e96707',
    marginTop: 10,
  },
  buttonRegister: {
    marginTop: 10,
  },
})
