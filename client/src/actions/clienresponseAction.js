import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { errorHandler } from '../errorHandling/errorHandler';
import axios from 'axios';
const userId=(JSON.parse(localStorage.getItem('users')))?.userId


export const getAllClientResponses = createAsyncThunk(
  '/api/clientresponse/get_all',
  async () => {
    try {
      const result = await api.get(`/api/clientresponse/get_all/${userId}`);
      return result.data.data;
    } catch (error) {
      errorHandler(error);
    }
  }
);
export const createClientResponse= createAsyncThunk(
  `/api/clientresponse/create`,
  async (updatedClientResponseData) => {
    try {
      const result = await api.post(`/api/clientresponse/create/${userId}`,updatedClientResponseData);
      console.log(updatedClientResponseData)
      console.log(result)
      return result.data.data;
    } catch (error) {
      errorHandler(error);
      console.log(error)
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
