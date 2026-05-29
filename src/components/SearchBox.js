import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch } from 'react-redux';
import { setDestination, setDestinationName } from '../redux/slices/rideSlice';
import { GoogleMapsKey } from '@env';

export default function SearchBox() {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="¿A dónde vas?"
        fetchDetails={true}
        minLength={2}
        debounce={400}
        enablePoweredByContainer={false}
        onPress={(data, details = null) => {
          dispatch(setDestination({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          }));
          dispatch(setDestinationName(data.description));
        }}
        query={{
          key: GoogleMapsKey,
          language: 'es',
          components: 'country:co',
        }}
        styles={{
          textInput: {
            backgroundColor: '#fff',
            borderRadius: 12,
            paddingHorizontal: 16,
            fontSize: 15,
            height: 50,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 4,
          },
          listView: {
            borderRadius: 12,
            marginTop: 4,
            elevation: 4,
          },
          row: {
            padding: 14,
          },
          description: {
            fontSize: 14,
            color: '#333',
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
});