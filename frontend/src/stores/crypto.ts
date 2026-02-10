import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { http } from '@/api/api.ts'

export const useCryptoStore = defineStore('crypto', () => {
  const encryptText = async (
    text: string,
    passphrase: string,
  ): Promise<string> => {
    try {
      const res = await http.post('/crypto/encrypt-text', {
        text,
        passphrase,
      });

      return res.data.encrypted;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw err.response?.data;
      }
      throw { code: 'UNKNOWN' };
    }
  };

  const decryptText = async (
    encrypted: string,
    passphrase: string,
  ): Promise<string> => {
    try {
      const res = await http.post('/crypto/decrypt-text', {
        encrypted,
        passphrase,
      });

      return res.data.decrypted;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw err.response?.data;
      }
      throw { code: 'UNKNOWN' };
    }
  };

  const generatePassphrase = (length: number) => {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=';

    const values = new Uint32Array(length);
    crypto.getRandomValues(values);

    return Array.from(values)
      .map(v => charset[v % charset.length])
      .join('');
  };

  return {
    generatePassphrase,
    encryptText,
    decryptText,
  };
});
