import { createSlice } from "@reduxjs/toolkit";
import toast from 'react-hot-toast'
import { login, getAllClients, createClient } from '../actions/userActions'

const clientReducer = createSlice({
  name: 'client',
  initialState: { loginCred: [], clients: [], status: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'successful';
        state.loginCred = action.payload
      })

      .addCase(getAllClients.fulfilled, (state, action) => {
        state.status = 'successful';
        state.clients = action.payload
      })

      .addCase(createClient.fulfilled, (state, action) => {
        state.status = 'successful';
        if (action.payload) state.clients.push(action.payload.data)
      })

  }
});

export default clientReducer.reducer;