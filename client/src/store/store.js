import { configureStore } from '@reduxjs/toolkit';
import userReducer from './../reducer/userReducer';
const myReducer = {
  data: userReducer
}

export const store = configureStore({
  reducer: myReducer,
  devTools: true
});