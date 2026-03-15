import { defineStore } from 'pinia'
import axios from 'axios'
import { http } from '@/api/api.ts'
import type { HistoryItem } from '@/types/types.ts'

export const useCryptoStore = defineStore('crypto', () => {
  const encryptText = async (
    text: string,
    passphrase: string,
    algorithm: string,
  ): Promise<string> => {
    try {
      const res = await http.post('/crypto/encrypt-text', {
        text,
        passphrase,
        algorithm,
      })

      return res.data.encrypted
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw err.response?.data
      }
      throw { code: 'UNKNOWN' }
    }
  }

  const decryptText = async (
    encrypted: string,
    passphrase: string,
    algorithm: string,
  ): Promise<string> => {
    try {
      const res = await http.post('/crypto/decrypt-text', {
        encrypted,
        passphrase,
        algorithm,
      })

      return res.data.decrypted
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw err.response?.data
      }
      throw { code: 'UNKNOWN' }
    }
  }

  const getHistory = async (): Promise<HistoryItem[]> => {
    try {
      const res = await http.get('/crypto/history')
      console.log(res)

      return res.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw err.response?.data
      }
      throw { code: 'UNKNOWN' }
    }
  }

  const generatePassphrase = (length: number) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+='

    const values = new Uint32Array(length)
    crypto.getRandomValues(values)

    return Array.from(values)
      .map((v) => charset[v % charset.length])
      .join('')
  }

  const encryptFile = async (file: File, passphrase: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('password', passphrase)

    const res = await http.post('/crypto/encrypt-file', formData, {
      responseType: 'blob',
    })

    const blob = new Blob([res.data])
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = file.name + '.enc'
    a.click()

    window.URL.revokeObjectURL(url)
  }

  const decryptFile = async (file: File, password: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('password', password)

    const res = await http.post('/crypto/decrypt-file', formData, {
      responseType: 'blob',
    })

    const blob = new Blob([res.data])
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url

    const baseName = file.name.replace(/\.enc$/, '')
    a.download = baseName

    a.click()

    window.URL.revokeObjectURL(url)
  }

  return {
    generatePassphrase,
    encryptText,
    decryptText,
    getHistory,
    encryptFile,
    decryptFile,
  }
})
