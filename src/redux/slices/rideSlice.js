import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    origin: null,
    destination: null,
    distance: null,
    duration: null,
    history: [],
    selectedCar: null,
    destinationName: null,
};

const rideSlice = createSlice({
    name: 'ride',
    initialState,
    reducers: {
        setOrigin: (state, action) => {
            state.origin = action.payload;
        },

        setDestination: (state, action) => {
            state.destination = action.payload;
        },

        setRideInfo: (state, action) => {
            state.distance = action.payload.distance;
            state.duration = action.payload.duration;
        },

        addRideToHistory: (state, action) => {
            state.history.push(action.payload);
        },

        setSelectedCar: (state, action) => {
            state.selectedCar = action.payload;
        },

        resetRide: (state) => {
            state.origin = null;
            state.destination = null;
            state.distance = null;
            state.duration = null;
            state.selectedCar = null;
        },
        
        setDestinationName: (state, action) => {
            state.destinationName = action.payload;
        }
  }});

export const { setOrigin, setDestination, setRideInfo, addRideToHistory, setSelectedCar, resetRide, setDestinationName } = rideSlice.actions;
export default rideSlice.reducer;