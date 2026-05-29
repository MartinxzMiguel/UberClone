import axios from 'axios';
import { GoogleMapsKey } from '@env';

export const getDistanceAndTime = async (origin, destination) => {
  try {
    const res = await axios.get(
      'https://maps.googleapis.com/maps/api/distancematrix/json',
      {
        params: {
          origins: `${origin.latitude},${origin.longitude}`,
          destinations: `${destination.latitude},${destination.longitude}`,
          key: GoogleMapsKey,
        },
      }
    );

    const element = res?.data?.rows?.[0]?.elements?.[0];
    if (!element || element.status !== "OK") return null;
    return element;

  } catch (error) {
    console.log(error);
    return null;
  }
};