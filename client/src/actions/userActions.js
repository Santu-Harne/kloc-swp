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
  '/api/user/create',
  async (userData) => {
    try {
      const result = await api.post('/api/user/create', userData)
      return result.data
    } catch (error) {
      errorHandler(error)
    }
  }
)

export const updateUser = createAsyncThunk(
  '/api/user/update',
  async (data) => {
    try {
      const result = await api.put(`/api/user/update/${data.userId}`, data.updateData)
      return result.data
    } catch (error) {
      errorHandler(error)
    }
  }
)

export const deleteUser = createAsyncThunk(
  '/api/user/delete',
  async (userId) => {
    try {
      const result = await api.delete(`/api/user/delete/${userId}`)
      return result.data
    } catch (error) {
      errorHandler(error)
    }
  }
)