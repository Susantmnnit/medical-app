import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    patients: [],
    _id:null,
    token: localStorage.getItem('token') || null,
    name: null,
    email: null,
    address: null,
    age: null,
    bloodgroup: null,
    problems: null,
    phone: null,
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    register_student: (state, action) => {
      // state.patients.push(action.payload);
    },
    redirect_to_dashboard: (state, action) => {
        
        state._id = action.payload._id; 
        state.name = action.payload.name; 
        state.email = action.payload.email;
        state.address = action.payload.address;
        state.age = action.payload.age;
        state.bloodgroup = action.payload.bloodgroup;
        state.problems = action.payload.problems;
        state.phone = action.payload.phone;
        state.token = action.payload.token;
    },
    logoutStudent: (state) => {
        
        state._id = null;
        state.name = null;
        state.email = null;
        state.address = null;
        state.age = null;
        state.bloodgroup = null;
        state.problems = null;
        state.phone = null;
        state.token = null;
    },
  },
});

export const { register_student, redirect_to_dashboard,logoutStudent} = patientsSlice.actions;
export default patientsSlice.reducer;
