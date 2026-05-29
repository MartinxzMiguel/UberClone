import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator} from 'react-native';
import { db } from '../services/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default function HistoryScreen() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTrips = async () => {
    try {
      const q = query(collection(db, "trips"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrips(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrips();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '--';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDestination = (destination) => {
    if (!destination) return '--';
    if (typeof destination === 'string') return destination;
    return `${destination.latitude?.toFixed(4)}, ${destination.longitude?.toFixed(4)}`;
  };

  const renderTrip = ({ item }) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.status === 'completed' ? '✅ Completado' : item.status}
          </Text>
        </View>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>

      <View style={styles.routeRow}>
        <View style={styles.routeDot} />
        <View style={styles.routeInfo}>
          <Text style={styles.routeLabel}>Origen</Text>
          <Text style={styles.routeValue}>Tecnológico de Antioquia</Text>
        </View>
      </View>

      <View style={styles.routeLine} />

      <View style={styles.routeRow}>
        <View style={[styles.routeDot, styles.routeDotDest]} />
        <View style={styles.routeInfo}>
          <Text style={styles.routeLabel}>Destino</Text>
          <Text style={styles.routeValue}>{item.destinationName || formatDestination(item.destination)}</Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.divider} />
      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Distancia</Text>
          <Text style={styles.detailValue}>{item.distance?.text || '--'}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Tiempo</Text>
          <Text style={styles.detailValue}>{item.duration?.text || '--'}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Servicio</Text>
          <Text style={styles.detailValue}>
            {item.selectedCar
              ? item.selectedCar.charAt(0).toUpperCase() + item.selectedCar.slice(1)
              : 'Economy'}
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValuePrice}>{item.fare ? `$ ${item.fare}` : '--'}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis viajes</Text>

      {trips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🚗</Text>
          <Text style={styles.emptyText}>No tienes viajes aún</Text>
          <Text style={styles.emptySubtext}>Tus viajes completados aparecerán aquí</Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderTrip}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#888',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginRight: 12,
  },
  routeDotDest: {
    backgroundColor: '#ff3b30',
  },
  routeLine: {
    width: 1,
    height: 16,
    backgroundColor: '#e0e0e0',
    marginLeft: 4,
    marginVertical: 2,
  },
  routeInfo: { flex: 1 },
  routeLabel: { fontSize: 11, color: '#aaa' },
  routeValue: { fontSize: 14, color: '#111', fontWeight: '500' },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: { alignItems: 'center' },
  detailLabel: { fontSize: 11, color: '#aaa', marginBottom: 2 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111' },
  detailValuePrice: { fontSize: 14, fontWeight: '700', color: '#000' },
});