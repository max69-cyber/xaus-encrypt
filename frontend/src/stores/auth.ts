import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { http } from '../api/api.ts';
import axios, { isAxiosError } from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));

  const isLoggedIn = computed(() => !!token.value);

  const setToken = (newToken: string | null) => {
    token.value = newToken;

    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const res = await http.post('/auth/login', { email, password });
      setToken(res.data.token);
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.code) {
        throw err.response?.data;
      }
      throw { code: 'UNKNOWN' }
    }

  }

  const register = async (email: string, password: string) => {
    try {
      const res = await http.post('/auth/register', { email, password });
      setToken(res.data.token);
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.code) {
        throw err.response?.data;
      }
      throw { code: 'UNKNOWN' }
    }
  }

  const logout = async () => {
    setToken(null);
  }

  return { token, isLoggedIn, signIn, register, logout };
})
