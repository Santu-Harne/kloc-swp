import { configureStore } from '@reduxjs/toolkit';
import userReducer from './../reducer/userReducer';
import sectionReducer from '../reducer/sectionReducer';
import competitiveAnalysisReducer from '../reducer/competitiveAnalysisReducer';
const myReducer = {
  data: userReducer,
  section: sectionReducer,
  competitiveAnalysisData:competitiveAnalysisReducer
}

export const store = configureStore({
  reducer: myReducer,
  devTools: true
});