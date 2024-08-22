import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import * as Constantes from '../utils/constantes';
import Constants from 'expo-constants';
// Import de componentes personalizados
import Input from '../components/Inputs/Input';
import Buttons from '../components/Buttons/Button';
import InputEmail from '../components/Inputs/InputEmail';

export default function RecuperarContrasena({ navigation }) {
    const ip = Constantes.IP;

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [nuevaClave, setNuevaClave] = useState('');

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert("Debes ingresar un correo electrónico");
            return;
        }
        if (!token.trim() || !nuevaClave.trim()) {
            Alert.alert("Debes llenar todos los campos");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('correo', email);
            formData.append('token', token);
            formData.append('clave', nuevaClave);
            const response = await fetch(`${ip}/T.Booksadre/api/services/public/cliente.php?action=recovery`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.status) {
                Alert.alert(
                    'Contraseña actualizada correctamente',
                    '',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Sesion'),
                        },
                    ]
                );
            } else {
                Alert.alert('Error', data.error);
            }
        } catch (error) {
            Alert.alert('Ocurrió un error al intentar actualizar la contraseña');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                <Text style={styles.texto}>Recuperar Contraseña</Text>

                <InputEmail
                    placeHolder='Correo Electrónico'
                    setValor={email}
                    setTextChange={setEmail}
                />

                <Input
                    placeHolder='Ingrese el Token'
                    setValor={token}
                    setTextChange={setToken}
                />

                <Input
                    placeHolder='Nueva Contraseña'
                    setValor={nuevaClave}
                    setTextChange={setNuevaClave}
                    secureTextEntry={true} // para que el texto se muestre como puntos
                />

                <Buttons
                    textoBoton='Actualizar Contraseña'
                    accionBoton={handleResetPassword}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#778DA9',
        paddingTop: Constants.statusBarHeight + 5,
    },
    scrollViewStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    texto: {
        color: '#322C2B',
        fontWeight: '900',
        fontSize: 20,
        marginBottom: 20
    },
});
