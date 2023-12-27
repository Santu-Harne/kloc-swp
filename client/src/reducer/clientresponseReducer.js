import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import { createClientResponse,getAllClientResponses} from '../actions/clienresponseAction'

const ClientResponseReducer=createSlice({
  name:'clientresponse',
  initialState: { status: 'idle', error: null,clientresponses:[] },
extraReducers: (builder) => {
  builder
    .addCase(getAllClientResponses.fulfilled, (state,action)=>{
      state.status='successful'
      state.clientresponses=action.payload
    })
    .addCase(createClientResponse.fulfilled,(state,action)=>{
      state.status='successful'
      if (action.payload){
        state.clientresponses.push(action.payload.data)
      }
    })
    

}
})

// // Selectors
// const selectSectionState = (state) => state.section;

// export const selectSections = createSelector(
//   [selectSectionState],
//   (section) => section.sections || [] // Provide a default empty array
// );

// export const selectSectionStatus = createSelector(
//   [selectSectionState],
//   (section) => section.status
// );

// export const selectSectionError = createSelector(
//   [selectSectionState],
//   (section) => section.error
// );

export default ClientResponseReducer.reducer;
