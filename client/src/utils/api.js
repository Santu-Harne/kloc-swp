import axios from 'axios'

// Create an Axios instance
const api = axios.create();

// Request interceptor to add the JWT token to the Authorization header
api.interceptors.request.use(
  async (config) => {

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;