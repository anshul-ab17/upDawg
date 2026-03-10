import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 5000,
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = token
    }
  }
  return config
})
