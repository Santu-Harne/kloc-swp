import { createSlice } from "@reduxjs/toolkit";
import toast from 'react-hot-toast'
import { login, getAllUsers, createUser } from '../actions/userActions'

const userReducer = createSlice({
  name: 'user',
  initialState: { loginCred: [], users: [], status: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'successful';
        state.loginCred = action.payload
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = 'successful';
        state.users = action.payload
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'successful';
        if (action.payload) state.users.push(action.payload.data)
      })

  }
});

export default userReducer.reducer;