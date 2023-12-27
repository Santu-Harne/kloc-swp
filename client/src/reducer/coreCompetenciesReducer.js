import { createSlice } from "@reduxjs/toolkit";
import { getAllCoreCompetencyNames,getAllCoreCompetencies,createCoreCompetencies } from "../actions/coreCompetenciesActions";

const coreCompetencies=createSlice({
    name:'coreCompetencies',
    initialState: { status: 'idle', error: null,coreCompetencyNames:[],coreCompetencies:[]},
    extraReducers: (builder) => {
        builder
        .addCase(getAllCoreCompetencyNames.fulfilled, (state,action)=>{
            state.status='successful'
            state.coreCompetencyNames=action.payload
          })
        .addCase(getAllCoreCompetencies.fulfilled,(state,action)=>{
            state.status='successful'
            state.coreCompetencies=action.payload
        })
        .addCase(createCoreCompetencies.fulfilled,(state,action)=>{
            state.status='successful'
            
        })
    }
})

export default coreCompetencies.reducer