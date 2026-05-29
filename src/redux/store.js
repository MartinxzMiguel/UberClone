import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import rideReducer from './slices/rideSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        ride: rideReducer,
    },
});