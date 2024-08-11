// Import necessary modules
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import your reducers
import patientsReducer from './Patientslice';
import doctorsReducer from './Doctorslice';

// Configuration for persisting patients reducer
const patientsPersistConfig = {
  key: 'patients',
  storage,
};

// Create persisted patients reducer
const persistedPatientReducer = persistReducer(patientsPersistConfig, patientsReducer);

// Configuration for persisting doctors reducer
const doctorsPersistConfig = {
  key: 'complaints',
  storage,
};

// Create persisted doctors reducer
const persistedDoctorsReducer = persistReducer(doctorsPersistConfig, doctorsReducer);


// Configure the Redux store
const store = configureStore({
  reducer: {
    patients: persistedPatientReducer,
    doctors: persistedDoctorsReducer,
  },
});

// Create a persistor
// const persistor = persistStore(store);
const persistor = persistStore(store, null, () => {
  // console.log('Persistor is now finished rehydrating the state');
});


// Export the store and persistor
export { store, persistor };
