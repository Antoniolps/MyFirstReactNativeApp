import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Pedido } from '../types/Pedido'
import { AuthContext } from '../contexts/Auth.Context'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Card, Chip, Button as PaperButton } from 'react-native-paper'

const PedidoList = () => {

    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const { user } = useContext(AuthContext)

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    useEffect(() => {
        if (!user) return
        const q = query(collection(db, 'pedidos'), where('uid', '==', user.uid))
        const unsub = onSnapshot(q, snap => {
            const lista: Pedido[] = []
            snap.forEach(d => {
                const data = d.data() as any
                lista.push({
                    id: d.id,
                    mesa: data.mesa,
                    itens: data.itens,
                    observacoes: data.observacoes || "",
                    criadoEm: data.criadoEm,
                    uid: data.uid,
                    status: data.status || "solicitado"
                })
            })
            setPedidos(lista)
        })
        return () => unsub()

    }, [user])

    const handleDelete = (id?: string) => {
        if (!id) return
        Alert.alert('Excluir pedido', 'Tem certeza que deseja excluir este pedido?', [
            { text: 'Cancelar', style: 'cancel' },
            { 
                text: 'Excluir', 
                style: 'destructive', 
                onPress: async () => {
                    try{
                        await deleteDoc(doc(db, 'pedidos', id))
                    }catch(error){
                        console.error("Erro ao excluir pedido:", error)
                    }
                }
            }
        ])
    }

    const handleEdit = (pedido: Pedido) => {
        if (!pedido) return
        navigation.navigate('NovoPedido', { pedido})
    }

    const changeStatus = (p: Pedido) => {
        if (!p.id) return

        Alert.alert("Entregue", `Confirma "ENTREGUE"?`, [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Entregue",
                onPress: async () => {
                    try {
                        await updateDoc(doc(db, 'pedidos', p.id!), { status: 'entregue', entregueEm: serverTimestamp() })
                    } catch (err) {
                        Alert.alert('Erro', 'Não foi possível atualizar o status do pedido.')
                    }
                }
            }
        ])
    }

    const renderItem = ({ item }: { item: Pedido }) => (
        <Card
            style={{
                marginVertical: 10,
                marginHorizontal: 10,
                padding: 10,
                alignSelf: 'stretch',
                opacity: item.status === 'entregue' ? 0.5 : 1,
            }}
        >
            <Card.Title
                title={`Mesa ${item.mesa}`}
                right={() => (
                    <Chip style={{ marginRight: 8 , backgroundColor: '#e9650767'}}>
                        <Text style={{ color: 'white' }}>{item.status.toUpperCase()}</Text>
                    </Chip>
                )}
            />
            <Card.Content>
                <Text>Itens: {item.itens}</Text>
                {item.observacoes ? <Text>Obs: {item.observacoes}</Text> : null}
            </Card.Content>
            <Card.Actions>
                <PaperButton style={{ borderColor: '#e96707'}} onPress={() => handleEdit(item)}>
                    <Text style={{ color: '#e96707' }}>Editar</Text>
                </PaperButton>
                <PaperButton style={{ backgroundColor: '#e96707' }} onPress={() => handleDelete(item.id)}>
                    <Text style={{ color: 'white' }}>Excluir</Text>
                </PaperButton>
                <View>
                    {item.status === 'preparado' && (
                    <PaperButton style={{ backgroundColor: '#4caf50' }} onPress={() => changeStatus(item)}>
                        <Text style={{ color: 'white' }}>Marcar Entregue</Text>
                    </PaperButton>
                )}
                </View>
            </Card.Actions>
        </Card>
    )

    return (
        <View style={{ width: '100%', alignSelf: 'stretch' }}>
            <FlatList
                data={pedidos}
                keyExtractor={i => i.id!}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 8 }}
                style={{ width: '100%', alignSelf: 'stretch' }}
            />
        </View>
    )
}

export default PedidoList

const styles = StyleSheet.create({})