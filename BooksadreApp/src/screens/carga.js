import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import * as Constantes from '../utils/constantes'

export default function Carga({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 3000); // Navega a 'Home' después de 3 segundos

    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../img/booksadre.png')}
        style={styles.logo}
      />
      <Text style={styles.text}>Bienvenido</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#026666',
  },
  logo: {
    width: 150,
    height: 250,
    marginBottom: 20,
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
});
