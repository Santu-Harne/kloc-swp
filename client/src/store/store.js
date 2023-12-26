import { configureStore } from '@reduxjs/toolkit';
import userReducer from './../reducer/userReducer';
import sectionReducer from '../reducer/sectionReducer';
import competitiveAnalysisReducer from '../reducer/competitiveAnalysisReducer';
import coreCompetenciesReducer from '../reducer/coreCompetenciesReducer';

import executiveSummary from '../reducer/executiveSummary';
import clientresponseReducer from '../reducer/clientresponseReducer';
 const myReducer = {
  data: userReducer,
  section: sectionReducer,
  competitiveAnalysisData:competitiveAnalysisReducer,
  coreCompetenciesData:coreCompetenciesReducer,
 executiveSummery :executiveSummary,
 clientresponse:clientresponseReducer
}

export const store = configureStore({
  reducer: myReducer,
  devTools: true
});