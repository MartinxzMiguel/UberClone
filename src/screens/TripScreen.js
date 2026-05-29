import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { GoogleMapsKey } from '@env';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { calculateFare } from '../utils/calculateFare';
import { resetRide } from '../redux/slices/rideSlice';
import { useDispatch } from 'react-redux';

export default function TripScreen() {
  const navigation = useNavigation();
  const rideInfo = useSelector((state) => state.ride);
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const intervalRef = useRef(null);

  const origin = { latitude: 6.2751, longitude: -75.5772 };
  const destination = rideInfo.destination;

  const [driverPosition, setDriverPosition] = useState(origin);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tripStarted, setTripStarted] = useState(false);
  const [arrived, setArrived] = useState(false);

  const fare = rideInfo.distance?.value && rideInfo.duration?.value
    ? Number(calculateFare(
        rideInfo.distance.value,
        rideInfo.duration.value,
        rideInfo.selectedCar || 'economy'
      )).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '--';

  useEffect(() => {
    if (tripStarted && routeCoordinates.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev < routeCoordinates.length - 1) {
            setDriverPosition(routeCoordinates[prev + 1]);
            return prev + 1;
          } else {
            setArrived(true);
            clearInterval(intervalRef.current);
            return prev;
          }
        });
      }, 300);
    }
    return () => clearInterval(intervalRef.current);
  }, [tripStarted, routeCoordinates]);

  const handlePayment = async () => {
    clearInterval(intervalRef.current);
    try {
      await addDoc(collection(db, "trips"), {
        destination: rideInfo.destination,
        destinationName: rideInfo.destinationName,
        distance: rideInfo.distance,
        duration: rideInfo.duration,
        fare: fare,
        date: new Date(),
        status: "completed"
      });
      dispatch(resetRide());
      Alert.alert("✅ Viaje completado", "¡Gracias por tu viaje!", [
        { text: "OK", onPress: () => navigation.replace("Home") }
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo guardar el viaje");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {destination?.latitude && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GoogleMapsKey}
            strokeWidth={4}
            strokeColor="#000"
            onReady={(result) => {
              setRouteCoordinates(result.coordinates);
              setTripStarted(true);
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 60, right: 60, bottom: 220, left: 60 },
                animated: true,
              });
            }}
            onError={(e) => console.log(e)}
          />
        )}

        <Marker coordinate={driverPosition} anchor={{ x: 0.5, y: 0.5 }}>
          <Text style={styles.driverIcon}>🚗</Text>
        </Marker>

        {destination?.latitude && (
          <Marker coordinate={destination} title="Destino" />
        )}
      </MapView>

      <View style={styles.panel}>
        {!arrived ? (
          <>
            <Text style={styles.title}>Viaje en curso</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Distancia</Text>
                <Text style={styles.infoValue}>{rideInfo.distance?.text || '--'}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Tiempo</Text>
                <Text style={styles.infoValue}>{rideInfo.duration?.text || '--'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancelar viaje</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.arrivedTitle}>🎉 ¡Llegaste!</Text>
            <Text style={styles.arrivedSubtitle}>Completa tu pago para finalizar</Text>
            <View style={styles.fareBox}>
              <Text style={styles.fareLabel}>Total a pagar</Text>
              <Text style={styles.fareValue}>$ {fare}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handlePayment}>
              <Text style={styles.buttonText}>Pagar viaje</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  driverIcon: { fontSize: 24 },
  panel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  infoBox: { alignItems: 'center' },
  infoLabel: { fontSize: 13, color: '#888' },
  infoValue: { fontSize: 16, fontWeight: '700', color: '#111' },
  button: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  arrivedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    marginBottom: 4,
  },
  arrivedSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  fareBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  fareLabel: { fontSize: 15, color: '#888' },
  fareValue: { fontSize: 20, fontWeight: '700', color: '#111' },
  cancelButton: { paddingVertical: 14, alignItems: 'center' },
  cancelText: { color: '#888', fontSize: 15 },
});