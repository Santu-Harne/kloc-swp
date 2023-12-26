import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { errorHandler } from '../errorHandling/errorHandler';

export const getAllQuestions = createAsyncThunk(
  '/api/question/getAll',
  async (sectionId) => {
    try {
      const result = await api.get(`/api/question/getAll/${sectionId}`);
      return result.data.data;
    } catch (error) {
      errorHandler(error);
    }
  }
);

// export const createSection = createAsyncThunk(
//   '/api/section/create',
//   async (sectionData) => {
//     try {
//       const result = await api.post('/api/section/create', sectionData);
//       return result.data;
//     } catch (error) {
//       errorHandler(error);
//     }
//   }
// );

// export const updateSection = createAsyncThunk(
//   '/api/section/update',
//   async ({ sectionId, updateData }) => {
//     try {
//       const result = await api.put(`/api/section/update/${sectionId}`, updateData);
//       return result.data;
//     } catch (error) {
//       errorHandler(error);
//     }
//   }
// );

// export const deleteSection = createAsyncThunk(
//   '/api/section/delete',
//   async (sectionId) => {
//     try {
//       const result = await api.delete(`/api/section/delete/${sectionId}`);
//       return result.data;
//     } catch (error) {
//       errorHandler(error);
//     }
//   }
// );
