import axios from 'axios'
import { useAuthStore } from '@/stores/auth.ts'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const http = axios.create({
  baseURL,
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  return config
})
