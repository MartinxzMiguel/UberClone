import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import MapView from 'react-native-maps';
import { setOrigin, setRideInfo } from '../redux/slices/rideSlice';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector, useDispatch } from 'react-redux';
import { GoogleMapsKey } from '@env';
import { PermissionsAndroid, Platform } from 'react-native';
import { getDistanceAndTime } from '../services/googleApi';

import SearchBox from '../components/SearchBox';
import RideOptions from '../components/RideOptions';

export default function HomeScreen() {
    const origin = useSelector(state => state.ride.origin);
    const destination = useSelector(state => state.ride.destination);
    const dispatch = useDispatch();
    const mapRef = useRef(null);
    const panelHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(panelHeight, {
        toValue: destination?.latitude ? 320 : 0,
        useNativeDriver: false,
      }).start();
    }, [destination]);

    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    };

    useEffect(() => {
      requestLocationPermission().then(granted => {
        if (granted) {
          Geolocation.getCurrentPosition(
            position => {
              dispatch(setOrigin({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }));
            },
            error => console.log("Geolocation error:", error),
            { enableHighAccuracy: true }
          );
        }
      });
    }, []);

    useEffect(() => {
      if (destination?.latitude) {
        const mapOrigin = { latitude: 6.2751, longitude: -75.5772 };
        mapRef.current?.fitToCoordinates(
          [mapOrigin, destination],
          {
            edgePadding: { top: 80, right: 80, bottom: 300, left: 80 },
            animated: true,
          }
        );
      }
    }, [destination]);

    useEffect(() => {
      if (destination?.latitude) {
        const mapOrigin = { latitude: 6.2751, longitude: -75.5772 };
        getDistanceAndTime(mapOrigin, destination).then(element => {
          if (element) {
            dispatch(setRideInfo({
              distance: element.distance,
              duration: element.duration
            }));
          }
        });
      }
    }, [destination]);

    useEffect(() => {
      if (destination?.latitude) {
        const mapOrigin = { latitude: 6.2751, longitude: -75.5772 };
        getDistanceAndTime(mapOrigin, destination);
      }
    }, [destination]);

    return (
        <View style={styles.container}>
          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation
            showsMyLocationButton={false}
            initialRegion={{
              latitude: 6.2751,
              longitude: -75.5772,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            
            {destination?.latitude && (
              <MapViewDirections
                origin={{ latitude: 6.2751, longitude: -75.5772 }}
                destination={destination}
                apikey={GoogleMapsKey}
                strokeWidth={4}
                strokeColor="black"
                onReady={(result) => {
                  mapRef.current?.fitToCoordinates(result.coordinates, {
                    edgePadding: { top: 80, right: 80, bottom: 300, left: 80 },
                    animated: true,
                  });
                }}
                onError={(error) => console.log("Directions error:", error)}
              />
            )}
          </MapView>

          <View style={styles.search}>
            <SearchBox />
          </View>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => {
              if (origin?.latitude) {
                mapRef.current?.animateToRegion({
                  latitude: origin.latitude,
                  longitude: origin.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }, 1000);
              }
            }}
          >
            <Text style={styles.locationIcon}>📍</Text>
          </TouchableOpacity>

          <Animated.View style={[styles.bottom, { height: panelHeight }]}>
            <RideOptions />
          </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  search: {
    position: 'absolute',
    top: 50,
    width: '100%',
  },
  locationButton: {
    position: 'absolute',
    top: 110,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  locationIcon: {
    fontSize: 20,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  }
});