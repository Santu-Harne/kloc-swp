import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './../reducer/clientReducer';
const myReducer = {
  clientsData: clientReducer
}

export const store = configureStore({
  reducer: myReducer,
  devTools: true
});