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

export const getAllUsers = createAsyncThunk(
  '/api/user/get_all',
  async () => {
    try {
      const result = await api.get('/api/user/get_all')
      return result.data.data
    } catch (error) {
      errorHandler(error)
    }
  }
)

export const createUser = createAsyncThunk(
  '/api/user/create_user',
  async (userData) => {
    try {
      const result = await api.post('/api/user/create_user', userData)
      return result.data
    } catch (error) {
      errorHandler(error)
    }
  }
)

export const updateUser = createAsyncThunk(
  '/api/user/update_user',
  async (userData, userId) => {
    try {
      const result = await api.put(`/api/user/update_user/${userId}`, userData)
      return result.data
    } catch (error) {
      errorHandler(error)
    }
  }
)