import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Constantes from '../utils/constantes';
import Constants from 'expo-constants';
// Import de componentes
import Input from '../components/Inputs/Input';
import InputMultiline from '../components/Inputs/InputMultiline';
import Buttons from '../components/Buttons/Button';
import MaskedInputTelefono from '../components/Inputs/MaskedInputTelefono';
import MaskedInputDui from '../components/Inputs/MaskedInputDui';
import InputEmail from '../components/Inputs/InputEmail';

export default function EditarPerfil({ navigation }) {
    const ip = Constantes.IP;

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [dui, setDui] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [clave, setClave] = useState('');
    const [confirmarClave, setConfirmarClave] = useState('');

    // Expresiones regulares para validar DUI y teléfono
    const duiRegex = /^\d{8}-\d$/;
    const telefonoRegex = /^\d{4}-\d{4}$/;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(`${ip}/T.Booksadre/api/services/public/cliente.php?action=readProfile`, {
                    method: 'GET',
                });
                const data = await response.json();
                if (data.status) {
                    const {
                        nombre_cliente,
                        apellido_cliente,
                        correo_cliente,
                        dui_cliente,
                        telefono_cliente,
                        nacimiento_cliente
                    } = data.dataset;

                    setNombre(nombre_cliente);
                    setApellido(apellido_cliente);
                    setEmail(correo_cliente);
                    setDui(dui_cliente);
                    setTelefono(telefono_cliente);
                    setFechaNacimiento(nacimiento_cliente);
                } else {
                    Alert.alert('Error', data.error);
                }
            } catch (error) {
                Alert.alert('Error', 'Hubo un problema al conectar con el servidor');
            }
        };

        fetchProfileData();
    }, []);

    /*
    Codigo para mostrar el datetimepicker
    */

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const fechaNueva = `${year}-${month}-${day}`;
        setFechaNacimiento(fechaNueva);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    /*
        Fin Codigo para mostrar el datetimepicker
    */

    const handleLogout = async () => {
        // Aquí iría el código de logout. Por ahora, redirige a 'Sesion'.
        navigation.navigate('Sesion');
    };

    const handleProfileUpdate = async () => {
        // Calcular la fecha mínima permitida (18 años atrás desde la fecha actual)
        const fechaMinima = new Date();
        fechaMinima.setFullYear(fechaMinima.getFullYear() - 18);

        // Validar los campos
        if (!nombre.trim() || !apellido.trim() || !email.trim() ||
            !dui.trim() || !fechaNacimiento.trim() || !telefono.trim()) {
            Alert.alert("Debes llenar todos los campos");
            return;
        } else if (!duiRegex.test(dui)) {
            Alert.alert("El DUI debe tener el formato correcto (########-#)");
            return;
        } else if (!telefonoRegex.test(telefono)) {
            Alert.alert("El teléfono debe tener el formato correcto (####-####)");
            return;
        } else if (new Date(fechaNacimiento) > fechaMinima) {
            Alert.alert('Error', 'Debes tener al menos 18 años para registrarte.');
            return;
        }

        try {
            // Si todos los campos son válidos, proceder con la actualización del perfil
            const formData = new FormData();
            formData.append('nombreCliente', nombre);
            formData.append('apellidoCliente', apellido);
            formData.append('correoCliente', email);
            formData.append('duiCliente', dui);
            formData.append('nacimientoCliente', fechaNacimiento);
            formData.append('telefonoCliente', telefono);

            const response = await fetch(`${ip}/T.Booksadre/api/services/public/cliente.php?action=editProfile`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.status) {
                Alert.alert(
                    'Perfil actualizado correctamente',
                    '',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('TabNavigator'),
                        },
                    ]
                );
            } else {
                Alert.alert('Error', data.error);
            }
        } catch (error) {
            Alert.alert('Ocurrió un error al intentar actualizar el perfil');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewStyle}>
                <Text style={styles.texto}>Editar Perfil</Text>
                <Input
                    placeHolder='Nombre Cliente'
                    setValor={nombre}
                    setTextChange={setNombre}
                />
                <Input
                    placeHolder='Apellido Cliente'
                    setValor={apellido}
                    setTextChange={setApellido}
                />
                <InputEmail
                    placeHolder='Email Cliente'
                    setValor={email}
                    setTextChange={setEmail}
                />
    
                <MaskedInputDui
                    dui={dui}
                    setDui={setDui}
                />
                <View style={styles.contenedorFecha}>
                    <Text style={styles.fecha}>Fecha Nacimiento</Text>

                    <TouchableOpacity onPress={showDatepicker}>
                        <Text style={styles.fechaSeleccionar}>Seleccionar Fecha:</Text>
                    </TouchableOpacity>
                    <Text style={styles.fecha}>Seleccion: {fechaNacimiento}</Text>

                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            minimumDate={new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate())} // Fecha mínima permitida (100 años atrás desde la fecha actual)
                            maximumDate={new Date()} // Fecha máxima permitida (fecha actual)
                            onChange={onChange}
                        />
                    )}
                </View>

                <MaskedInputTelefono
                    telefono={telefono}
                    setTelefono={setTelefono}
                />
                <Buttons
                    textoBoton='Actualizar Perfil'
                    accionBoton={handleProfileUpdate}
                />

        
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#778DA9',
        paddingTop: Constants.statusBarHeight + 5, // el 5 es para darle un pequeño margen cuando hay una cámara en el centro de la pantalla
    },
    scrollViewStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    texto: {
        color: '#322C2B',
        fontWeight: '900',
        fontSize: 20
    },
    textRegistrar: {
        color: '#322C2B',
        fontWeight: '700',
        fontSize: 18
    },
    fecha: {
        fontWeight: '600',
        color: '#000000'
    },
    fechaSeleccionar: {
        fontWeight: '700',
        color: '#322C2B',
        textDecorationLine: 'underline'
    },
    contenedorFecha: {
        backgroundColor: '#D9D9D9',
        color: "#000000",
        fontWeight: '800',
        width: 250,
        borderRadius: 5,
        padding: 5,
        marginVertical: 10
    }
});
