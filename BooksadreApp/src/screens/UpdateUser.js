import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

export default function UpdateUser({ navigation }) {

  const volverInicio = () => {
    navigation.navigate('TabNavigator');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar Usuario</Text>
      <Text style={styles.subtitle}>PROXIMAMENTE ...</Text>
      <TouchableOpacity style={styles.button} onPress={volverInicio}>
        <Text style={styles.buttonText}>Volver a Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#778DA9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#ffffff', // Brown color for the title
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 10,
    color: '#ffffff', // Brown color for the subtitle
  },
  button: {
    backgroundColor: '#39C03F', // Brown color for the button
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
});
