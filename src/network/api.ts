import axios from 'axios'

// Create an axios instance with auth token header
export const axiosWithToken = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add interceptor to add token from localStorage
axiosWithToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Handle response and error
axiosWithToken.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
