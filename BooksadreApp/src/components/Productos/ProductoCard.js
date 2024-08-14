import { StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

export default function ProductoCard({ ip, imagenProducto, idProducto, nombreProducto, descripcionProducto, precioProducto, existenciasProducto, accionBotonProducto }) {

  const [modalVisible, setModalVisible] = useState(false);
  const [comentariosValoraciones, setComentariosValoraciones] = useState([]);

  const openModal = () => {
    setModalVisible(true);
    fillCommentsAndRatings();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const fillCommentsAndRatings = async () => {
    try {
      const formData = new FormData();
      formData.append('idProducto', idProducto);

      const response = await fetch(`${ip}/T.Booksadre/api/services/public/producto.php?action=getCommentsAndRatings`, {
        method: 'POST',
        body: formData,
      });

      const comentariosValoracionesData = await response.json();

      if (comentariosValoracionesData.status && Array.isArray(comentariosValoracionesData.dataset)) {
        setComentariosValoraciones(comentariosValoracionesData.dataset);
      } else {
        setComentariosValoraciones([]);
      }
    } catch (error) {
      console.error('Error fetching comments and ratings:', error);
      setComentariosValoraciones([]);
    }
  };

  const generateStars = (calificacion) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i < calificacion ? 'star' : 'star-o'}
          size={16}
          color="gold"
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `${ip}/T.Booksadre/api/images/productos/${imagenProducto}` }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.text}>{idProducto}</Text>
      <Text style={styles.textTitle}>{nombreProducto}</Text>
      <Text style={styles.text}>{descripcionProducto}</Text>
      <Text style={styles.textTitle}>Precio: <Text style={styles.textDentro}>${precioProducto}</Text></Text>
      <Text style={styles.textTitle}>Existencias: <Text style={styles.textDentro}>{existenciasProducto} {(existenciasProducto === 1) ? 'Unidad' : 'Unidades'}</Text></Text>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={accionBotonProducto}>
        <FontAwesome name="plus-circle" size={24} color="white" />
        <Text style={styles.cartButtonText}>Seleccionar Producto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.reviewButton}
        onPress={openModal}>
        <FontAwesome name="comments" size={24} color="white" />
        <Text style={styles.reviewButtonText}>Ver Valoraciones</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Valoraciones del Producto</Text>
            <ScrollView style={styles.commentList}>
              {comentariosValoraciones.length > 0 ? (
                comentariosValoraciones.map((comment, index) => (
                  <View key={index} style={styles.commentCard}>
                    <Text style={styles.commentTitle}>{comment.nombre_cliente} {comment.apellido_cliente}</Text>
                    <View style={styles.commentStars}>
                      {generateStars(comment.calificacion)}
                    </View>
                    <Text style={styles.commentDate}>{formatDate(comment.fecha_valoracion)}</Text>
                    <Text style={styles.commentText}>{comment.comentario}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noCommentsText}>No hay comentarios ni valoraciones disponibles.</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 1,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: '65%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  textTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '700'
  },
  textDentro: {
    fontWeight: '400'
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#39C03F',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  cartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    textAlign: 'center'
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d6efd', // Color azul para diferenciarlo
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  reviewButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo del modal más oscuro
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    width: '90%', // Puedes ajustar el ancho del modal aquí
    maxHeight: '80%', // Ajusta la altura máxima del modal aquí
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  commentList: {
    maxHeight: '70%', // Ajusta la altura máxima de la lista de comentarios aquí
  },
  commentCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentStars: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: '#39C03F',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
