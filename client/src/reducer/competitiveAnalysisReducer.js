import { createSlice } from "@reduxjs/toolkit";
import {getAllCompetitiveAnalysis,createCompetitiveAnalysis} from '../actions/competitiveAnalysisActions'
 
const CompetitiveAnalysisReducer=createSlice({
    name:'competitiveAnalysis',
    initialState: { status: 'idle', error: null,competitiveAnalysis:[] },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCompetitiveAnalysis.fulfilled, (state,action)=>{
        state.status='successful'
        state.competitiveAnalysis=action.payload
      })
      .addCase(createCompetitiveAnalysis.fulfilled,(state,action)=>{
        state.status='successful'
        if (action.payload){
          state.competitiveAnalysis.push(action.payload.data)
        }
      })
      

  }
})
export default CompetitiveAnalysisReducer.reducer