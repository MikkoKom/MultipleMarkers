import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const App = () => {
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });

      setLoading(false); // Stop loading once location is fetched
    };

    getUserLocation();
  }, []);

  // Handle adding a marker on long press
  const handleLongPress = (event) => {
    const { coordinate } = event.nativeEvent;
    // Add a marker with a unique ID
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      { id: Date.now(), coordinate },
    ]);
  };

  // Handle marker press to remove it
  const handleMarkerPress = (markerId) => {
    setMarkers((prevMarkers) => prevMarkers.filter(marker => marker.id !== markerId));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={region}
          onLongPress={handleLongPress}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              onPress={() => handleMarkerPress(marker.id)} // Attach the remove function
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
