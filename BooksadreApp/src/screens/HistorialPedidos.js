import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Modal, TextInput, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importa Picker
import * as Constantes from '../utils/constantes';

const HistorialPedidos = () => {
    const ip = Constantes.IP;
    const [pedidos, setPedidos] = useState([]);
    const [productosComprados, setProductosComprados] = useState([]);
    const [filteredPedidos, setFilteredPedidos] = useState([]); // Para datos filtrados
    const [searchQuery, setSearchQuery] = useState(''); // Para la búsqueda
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [calificacion, setCalificacion] = useState(null);
    const [comentario, setComentario] = useState('');
    const [imagenProducto, setImagenProducto] = useState('default.png'); // Imagen predeterminada

    useEffect(() => {
        loadPedidos();
        loadProductosComprados();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = pedidos.filter(pedido =>
                pedido.nombre_producto.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredPedidos(filtered);
        } else {
            setFilteredPedidos(pedidos);
        }
    }, [searchQuery, pedidos]);

    const loadPedidos = async () => {
        try {
            const response = await fetch(`${ip}/T.Booksadre/api/services/public/pedido.php?action=getHistory`);
            const result = await response.json();
            if (result.status) {
                setPedidos(result.dataset);
                setFilteredPedidos(result.dataset); // Inicializa los datos filtrados
            } else {
                console.error('Error loading pedidos:', result.error);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const loadProductosComprados = async () => {
        try {
            const response = await fetch(`${ip}/T.Booksadre/api/services/public/pedido.php?action=getProductosComprados`);
            const result = await response.json();
            if (result.status) {
                setProductosComprados(result.dataset);
            } else {
                console.error('Error loading productos comprados:', result.error);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const openModal = () => {
        setShowModal(true);
        setCalificacion(null);
        setComentario('');
        setImagenProducto('default.png'); // Resetea la imagen a predeterminada
    };

    const submitValoracion = async () => {
        if (!selectedProduct || !calificacion) {
            alert('Por favor, selecciona un producto y una calificación.');
            return;
        }

        const formData = new FormData();
        formData.append('productoValoracion', selectedProduct);
        formData.append('calificacionValoracion', calificacion);
        formData.append('comentarioValoracion', comentario);

        try {
            const response = await fetch(`${ip}/T.Booksadre/api/services/public/pedido.php?action=createValoracion`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                if (result.status) {
                    alert('Valoración enviada correctamente.');
                    setShowModal(false);
                    loadPedidos(); // Carga nuevamente los pedidos después de enviar la valoración
                } else {
                    alert(`Error: ${result.error || 'Error desconocido'}`);
                }
            } else {
                alert('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('Error submitting valoracion:', error);
            alert('Se produjo un error al enviar la valoración. Por favor, inténtelo de nuevo.');
        }
    };

    const handleProductChange = (itemValue) => {
        setSelectedProduct(itemValue);
        const selectedProduct = productosComprados.find(p => p.id_producto === itemValue);
        setImagenProducto(selectedProduct ? selectedProduct.imagen_producto : 'default.png');
    };

    const renderPedidoItem = ({ item }) => (
        <View style={styles.pedidoItem}>
            <Text style={styles.pedidoText}>{item.nombre_producto}</Text>
            <Text style={styles.pedidoText}>Precio: {item.precio_producto} US$</Text>
            <Text style={styles.pedidoText}>Cantidad: {item.cantidad_producto}</Text>
            <Text style={styles.pedidoText}>Estado: {item.estado_pedido}</Text>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Producto</Text>
            <Text style={styles.headerText}>Precio</Text>
            <Text style={styles.headerText}>Cantidad</Text>
            <Text style={styles.headerText}>Estado</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historial de Pedidos</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar pedido..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={filteredPedidos}
                renderItem={renderPedidoItem}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={renderHeader}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
            <Button title="Calificar productos" onPress={openModal} color="#28a745" />
            <Modal visible={showModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Reseña del producto</Text>
                        <Picker
                            selectedValue={selectedProduct}
                            onValueChange={handleProductChange}
                            style={styles.picker}
                        >
                            <Picker.Item label="Selecciona un producto" value="" />
                            {productosComprados.map((product) => (
                                <Picker.Item
                                    key={product.id_producto}
                                    label={product.nombre_producto}
                                    value={product.id_producto}
                                />
                            ))}
                        </Picker>
                        <Image
                            source={{ uri: `${ip}/T.Booksadre/api/images/productos/${imagenProducto}` }}
                            style={styles.productImage}
                        />
                        <Text style={styles.label}>Calificación</Text>
                        <View style={styles.ratingContainer}>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <TouchableOpacity key={rating} onPress={() => setCalificacion(rating)}>
                                    <Text style={calificacion >= rating ? styles.selectedStar : styles.star}>
                                        ★
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Escribe tu comentario aquí..."
                            value={comentario}
                            onChangeText={setComentario}
                            multiline={true}
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Guardar" onPress={submitValoracion} color="#28a745" />
                            <Button title="Cancelar" onPress={() => setShowModal(false)} color="red" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    pedidoItem: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    pedidoText: {
        flex: 1,
        textAlign: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 15,
    },
    productImage: {
        width: '100%',
        height: 200, // Aumenta el tamaño de la imagen
        marginBottom: 15,
        resizeMode: 'contain',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    star: {
        fontSize: 30,
        color: '#ccc',
    },
    selectedStar: {
        fontSize: 30,
        color: '#FFD700',
    },
    input: {
        height: 80,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default HistorialPedidos;
