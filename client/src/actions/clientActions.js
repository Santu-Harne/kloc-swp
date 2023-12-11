import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { errorHandler } from '../errorHandling/errorHandler';
import api from '../utils/api';
import toast from 'react-hot-toast'

export const login = createAsyncThunk(
  '/api/login',
  async (userCred) => {
    try {
      const result = await api.post('/api/login', userCred)
      return result.data
    } catch (error) {
      errorHandler(error)
    }
  })

export const getAllClients = createAsyncThunk(
  '/api/client/get_all',
  async () => {
    try {
      const result = await api.get('/api/client/get_all')
      return result.data.data
    } catch (error) {
      errorHandler(error)
    }
  }
)

export const createClient = createAsyncThunk(
  '/api/client/create_client',
  async (clientData) => {
    try {
      const result = await api.post('/api/client/create_client', clientData)
      return result.data
    } catch (error) {
      errorHandler(error)
    }
  }
)