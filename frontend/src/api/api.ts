import axios from 'axios'
import { useAuthStore } from '@/stores/auth.ts'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});
