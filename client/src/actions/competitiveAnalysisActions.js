import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { errorHandler } from '../errorHandling/errorHandler';
import api from '../utils/api';
const userId=(JSON.parse(localStorage.getItem('users')))?.userId
export const getAllCompetitiveAnalysis=createAsyncThunk(
    `/api/competitiveAnalysis/getAll/`,
    async(userId)=>{
      try{
        const result=await api.get(`/api/competitiveAnalysis/getAll/${userId}`)
        return result.data.data
      }catch(error){
        errorHandler(error)
      }
    }
  )
export const createCompetitiveAnalysis=createAsyncThunk(
  `/api/competitiveAnalysis/create/`,
  async(competitiveAnalysisData)=>{
    try{
      console.log(competitiveAnalysisData)
      const result=await api.post(`/api/competitiveAnalysis/create/${userId}`,competitiveAnalysisData)
      console.log(result)
      return result.data
    }catch(error){
        errorHandler(error)
      }
  }
)