import { configureStore } from '@reduxjs/toolkit';
import userReducer from './../reducer/userReducer';
import sectionReducer from '../reducer/sectionReducer';
const myReducer = {
  data: userReducer,
  section: sectionReducer,
}

export const store = configureStore({
  reducer: myReducer,
  devTools: true
});