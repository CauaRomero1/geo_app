import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [gymTitle, setGymTitle] = useState('');
  const [gymData, setGymData] = useState(null);
  const [location, setLocation] = useState(null);

  const markers = [
    {
      coordinate: { latitude: -8.049136542613661, longitude: -34.87848838043232 },
      title: "Academia Havana",
      description: "Av. Cruz Cabugá, 555"
    },
    {
      coordinate: { latitude: -8.053874434953736, longitude: -34.892779190758894 },
      title: "UB Fit",
      description: "R. Padre Inglês, 356"
    },
    {
      coordinate: { latitude: -8.058548534508782, longitude: -34.88754351850712 },
      title: "Academia Smart Fit",
      description: "Av. Conde da Boa Vista, 770"
    },
    {
      coordinate: { latitude: -8.050487256953833, longitude: -34.89491800003354 },
      title: "Activa Fitner",
      description: "Av. Conselheiro Rosa e Silva, 172"
    },
    {
      coordinate: { latitude: -8.058398736184058, longitude: -34.89256838497249 },
      title: "Academia CAF",
      description: "R. do Progresso, 429"
    },
    {
      coordinate: { latitude: -8.046989584992067, longitude: -34.879543577362526 },
      title: "Felipe Cena Physical",
      description: "R. Frei Cassimiro, 232"
    },
    {
      coordinate: { latitude: -8.05701775739899, longitude: -34.89007929464444 },
      title: "Corpo em Movimento Studio",
      description: "R. da Soledade, 357"
    } 
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (gymTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um nome de academia válido.');
      return;
    }
    try {
      const apiKey = 'YOUR_OMDB_API_KEY'; // Substitua pelo seu próprio API Key
      const apiUrl = `https://www.omdbapi.com/?t=${gymTitle}&apikey=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.Response === 'True') {
        setGymData(data);
      } else {
        Alert.alert('Erro', 'Academia não encontrada. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca da academia. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Busca de Academias</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome da academia"
        value={gymTitle}
        onChangeText={(text) => setGymTitle(text)}
      />
      <Button title="Buscar Academia" onPress={handleSearch} />
      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationTitle}>Sua Localização</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua Localização"
            />
            {markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
              />
            ))}
          </MapView>
        </View>
      )}
      {gymData && (
        <View style={styles.gymDataContainer}>
          <Text style={styles.gymTitle}>{gymData.Title}</Text>
          <Text>Ano: {gymData.Year}</Text>
          <Text>Gênero: {gymData.Genre}</Text>
          <Text>Diretor: {gymData.Director}</Text>
          <Text>Prêmios: {gymData.Awards}</Text>
        </View>
      )}
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
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
  },
  locationContainer: {
    marginTop: 20,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: 10,
  },
  gymDataContainer: {
    marginTop: 20,
  },
  gymTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
