import axios from "axios"
import { getToken, removeToken } from "@/lib/auth"

const RAILWAY_URL = "https://centrai-api-production.up.railway.app"
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL
// Next.js bakes NEXT_PUBLIC_ vars as "" when unset — fall back to hardcoded Railway URL
const BASE_URL = rawApiUrl && rawApiUrl !== "undefined" ? rawApiUrl : RAILWAY_URL

export const apiClient = axios.create({
  baseURL: BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)
