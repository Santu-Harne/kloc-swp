import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'
import { errorHandler } from '../errorHandling/errorHandler';
import api from '../utils/api';
const userId=(JSON.parse(localStorage.getItem('users')))?.userId

export const getAllCoreCompetencyNames=createAsyncThunk(
    '/api/coreCompetencyName/getAll',
    async()=>{
        try{
            const result=await api.get(`/api/coreCompetencyName/getAll`)
            return result.data.data
        }catch(error){
            errorHandler(error)
        }
    }
)

export const getAllCoreCompetencies=createAsyncThunk(
    '/api/coreCompetencies/getAll',
    async()=>{
        try{
            const result=await api.get(`/api/coreCompetencies/getAll/${userId}`)
            return result.data.data
        }catch(error){
            errorHandler(error)
        }
    }
)

export const createCoreCompetencies=createAsyncThunk(
    '/api/coreCompetencies/create',
    async(coreCompetenciesData)=>{
        try{
            const result=await api.post(`/api/coreCompetencies/create/${userId}`,coreCompetenciesData)
            return result.data
        }catch(error){
            errorHandler(error)
        }
    }
)