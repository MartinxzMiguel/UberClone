import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GoogleMapsKey } from '@env';
import { calculateFare } from '../utils/calculateFare';

export default function RideScreen() {
  const navigation = useNavigation();
  const rideInfo = useSelector((state) => state.ride);
  const mapRef = useRef(null);

  const mapOrigin = { latitude: 6.2751, longitude: -75.5772 };

  const fare = rideInfo.distance?.value && rideInfo.duration?.value
    ? calculateFare(rideInfo.distance.value, rideInfo.duration.value, rideInfo.selectedCar || 'economy')
    : null;

  const handleStart = () => {
    navigation.navigate("Trip");
  };
  
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: mapOrigin.latitude,
          longitude: mapOrigin.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {rideInfo.destination?.latitude && (
          <MapViewDirections
            origin={mapOrigin}
            destination={rideInfo.destination}
            apikey={GoogleMapsKey}
            strokeWidth={4}
            strokeColor="#000"
            onReady={(result) => {
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
                animated: true,
              });
            }}
            onError={(e) => console.log(e)}
          />
        )}
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.title}>Confirmar viaje</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Distancia</Text>
          <Text style={styles.infoValue}>{rideInfo.distance?.text || '--'}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Tiempo estimado</Text>
          <Text style={styles.infoValue}>{rideInfo.duration?.text || '--'}</Text>
        </View>

        {fare && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Precio estimado</Text>
            <Text style={styles.fare}>
              $ {Number(fare).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Iniciar viaje</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    height: '45%',
  },
  panel: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 15,
    color: '#888',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  fare: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    color: '#888',
    fontSize: 15,
  },
});