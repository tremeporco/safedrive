import React, { useState, useEffect } from 'react';

import {
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
  View,
} from 'react-native';

import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import Botao from './components/Botao';
import CardOcorrencia from './components/CardOcorrencia';

import {
  initDB,
  insertOcorrencia,
  getOcorrencias,
  deleteOcorrencia
} from './database';

export default function App() {

  const [comentario, setComentario] = useState('');
  const [ocorrencias, setOcorrencias] = useState([]);

  
  useEffect(() => {
    initDB();
    getOcorrencias(setOcorrencias);
  }, []);

  function deletarOcorrencia(id) {
    deleteOcorrencia(id);
    getOcorrencias(setOcorrencias);
    Alert.alert('Ocorrência removida 🗑️');
  }

  async function registrarOcorrencia() {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão negada');
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({});

      if (!comentario) {
        Alert.alert('Digite um comentário 🚧');
        return;
      }

      const novaOcorrencia = {
        id: Date.now().toString(),
        comentario,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

   
      insertOcorrencia(novaOcorrencia);

    
      getOcorrencias(setOcorrencias);

      setComentario('');
      Alert.alert('Ocorrência registrada 📍');

    } catch (erro) {
      console.log(erro);
      Alert.alert('Erro ao pegar localização');
    }
  }

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.titulo}>
        SafeDrive GPS 📍
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Descreva o problema..."
        placeholderTextColor="#666"
        value={comentario}
        onChangeText={setComentario}
      />

      <Botao
        texto="Registrar Ocorrência 📍"
        cor="#2563eb"
        onPress={registrarOcorrencia}
      />

      <Text style={styles.subtitulo}>
        Ocorrências
      </Text>

      <FlatList
        data={ocorrencias}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardOcorrencia
            item={item}
            onDelete={deletarOcorrencia}
          />
        )}
      />

      <Text style={styles.subtitulo}>
        Mapa das Ocorrências 🗺️
      </Text>

      <View style={styles.mapaContainer}>
        <MapView
          style={styles.mapa}
          initialRegion={{
            latitude:
              ocorrencias.length > 0
                ? ocorrencias[0].latitude
                : -23.55052,

            longitude:
              ocorrencias.length > 0
                ? ocorrencias[0].longitude
                : -46.633308,

            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {ocorrencias.map((item) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title="Ocorrência"
              description={item.comentario}
            />
          ))}
        </MapView>
      </View>

    </ScrollView>
  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 20,
    paddingTop: 50,
  },

  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#facc15',
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },

  subtitulo: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },

  mapaContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },

  mapa: {
    width: '100%',
    height: '100%',
  },

});