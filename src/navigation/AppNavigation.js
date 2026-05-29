import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigation from './TabNavigation';
import AuthScreen from '../screens/AuthScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RideScreen from '../screens/RideScreen';
import TripScreen from '../screens/TripScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  if (user === undefined) return null; 

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // User Authenticated
          <>
            <Stack.Screen name="Home" component={TabNavigation} options={{ headerShown: false }} />
            <Stack.Screen name="Ride" component={RideScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Trip" component={TripScreen} options={{ headerShown: false }} />
          </>
        ) : (
          // No user authenticated
          <>
            <Stack.Screen name="Login" component={AuthScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}