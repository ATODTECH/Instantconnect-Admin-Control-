import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  // The session is a pair of httpOnly cookies the API sets; they only travel with this on.
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && !error.response) {
      return Promise.reject(new Error("We couldn't reach the server. Check your connection and try again."))
    }

    if (axios.isAxiosError(error) && error.response?.status === 429) {
      return Promise.reject(new Error("Too many attempts. Wait a minute and try again."))
    }

    const message: string = error.response?.data?.message ?? "Something went wrong. Try again."
    return Promise.reject(new Error(message))
  },
)

export default api
