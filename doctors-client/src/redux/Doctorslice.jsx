import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    doctors: [],
    _id:null,
    token: localStorage.getItem('token') || null,
    name: null,
    email: null,
    address: null,
    city: null,
    pin: null,
    clinic_name: null,
    specalist: null,
    phone: null,
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    register_doctors: (state, action) => {
      state.patients.push(action.payload);
    },
    redirect_to_dashboard_doctors: (state, action) => {
          
        state._id = action.payload._id; 
        state.name = action.payload.name; 
        state.email = action.payload.email;
        state.address = action.payload.address;
        state.city = action.payload.city;
        state.pin = action.payload.pin;
        state.clinic_name = action.payload.clinic_name;
        state.phone = action.payload.phone;
        state.specalist = action.payload.specalist;
      state.token = action.payload.token;
    },
    logoutDoctor: (state) => {
        
        state._id = null;
        state.name = null; 
        state.email = null;
        state.address = null;
        state.city = null;
        state.pin = null;
        state.clinic_name = null;
        state.phone = null;
        state.specalist = null;
        state.token = null;
    },
  },
});

export const { redirect_to_dashboard_doctors,logoutDoctor} = doctorSlice.actions;
export default doctorSlice.reducer;
