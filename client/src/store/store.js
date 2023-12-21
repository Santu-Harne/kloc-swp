import { configureStore } from '@reduxjs/toolkit';
import userReducer from './../reducer/userReducer';
import competitiveAnalysisReducer from '../reducer/competitiveAnalysisReducer';
const myReducer = {
  data: userReducer,
  competitiveAnalysisData:competitiveAnalysisReducer
}

export const store = configureStore({
  reducer: myReducer,
  devTools: true
});