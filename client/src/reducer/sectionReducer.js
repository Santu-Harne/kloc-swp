import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import { getAllSections, createSection, updateSection, deleteSection } from '../actions/sectionActions';

const sectionReducer = createSlice({
  name: 'section',
  initialState: { sections: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSections.fulfilled, (state, action) => {
        state.status = 'successful';
        state.sections = action.payload;
      })

      .addCase(createSection.fulfilled, (state, action) => {
        state.status = 'successful';
        if (action.payload) state.sections.push(action.payload.data);
      })

      .addCase(updateSection.fulfilled, (state, action) => {
        state.status = 'successful';
        if (action.payload) {
          const index = state.sections.findIndex(section => section?.sectionId === action.payload?.data?.sectionId);
          state.sections.splice(index, 1, action.payload.data);
        }
      })

      .addCase(deleteSection.fulfilled, (state, action) => {
        state.status = 'successful';
        if (action.payload) {
          const index = state.sections.findIndex(section => section?.sectionId === action.payload?.deletedId);
          state.sections.splice(index, 1);
        }
      });
  }
});

// Selectors
const selectSectionState = (state) => state.section;

export const selectSections = createSelector(
  [selectSectionState],
  (section) => section.sections || [] // Provide a default empty array
);

export const selectSectionStatus = createSelector(
  [selectSectionState],
  (section) => section.status
);

export const selectSectionError = createSelector(
  [selectSectionState],
  (section) => section.error
);

export default sectionReducer.reducer;
