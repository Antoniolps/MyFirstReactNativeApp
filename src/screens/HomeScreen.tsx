import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StyleSheet, View, Image } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { RootStackParamList } from '../navigation/types'
import { useNavigation } from '@react-navigation/native'

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 20, alignItems: 'center' }}>
                {/* Logo do app */}
                <Image
                    source={require('../../assets/logo.png')}
                    style={{ width: 100, height: 100, marginBottom: 10}}
                    resizeMode='contain'
                />
                <Text variant='titleLarge'>Meus pedidos</Text>
                <Button
                    mode='contained'
                    style={{ width: '100%', marginTop: 20, backgroundColor: '#e96707'}}                
                >
                    <Text style={{ color: 'white' }}>Novo pedido</Text>
                </Button>
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({

})