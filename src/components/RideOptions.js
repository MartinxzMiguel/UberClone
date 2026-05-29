import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { calculateFare } from '../utils/calculateFare';
import { useNavigation } from '@react-navigation/native';
import { setSelectedCar, resetRide } from '../redux/slices/rideSlice';

const cars = [
  { id: 1, name: 'Economy', icon: '🚗', desc: 'Viaje cómodo y económico' },
  { id: 2, name: 'XL',      icon: '🚙', desc: 'Para grupos de hasta 6' },
  { id: 3, name: 'Premium', icon: '🏎️', desc: 'Experiencia de lujo' },
];

export default function RideOptions() {
  const [selected, setSelected] = useState(null);
  const distance = useSelector(state => state.ride.distance);
  const duration = useSelector(state => state.ride.duration);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      {/* Handle bar */}
      <View style={styles.handle} />
      <Text style={styles.title}>Elige tu viaje</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {cars.map(car => {
          const isSelected = selected?.id === car.id;
          const fare = distance?.value && duration?.value
            ? calculateFare(distance.value, duration.value, car.name.toLowerCase())
            : null;

          return (
            <TouchableOpacity
              key={car.id}
              onPress={() => {
                setSelected(car);
                dispatch(setSelectedCar(car.name.toLowerCase()));
              }}
              style={[styles.card, isSelected && styles.cardSelected]}
            >
              <Text style={styles.carIcon}>{car.icon}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.carName}>{car.name}</Text>
                <Text style={styles.carDesc}>{car.desc}</Text>
              </View>
              {fare && (
                <Text style={styles.fare}>$ {Number(fare).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.confirmButton, !selected && styles.confirmDisabled]}
        onPress={() => selected && navigation.navigate("Ride")}
        disabled={!selected}
      >
        <Text style={styles.confirmText}>
          {selected ? `Confirmar ${selected.name}` : 'Selecciona un viaje'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          setSelected(null);
          dispatch(resetRide());
        }}
      >
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 6,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  cardSelected: {
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
  },
  carIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  carDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  fare: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  confirmButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmDisabled: {
    backgroundColor: '#ccc',
  },
  confirmText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#888',
    fontSize: 14,
  },
});