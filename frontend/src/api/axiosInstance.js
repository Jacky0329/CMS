import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return axiosInstance(originalRequest)
                    })
                    .catch((err) => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            const refreshToken = localStorage.getItem('refresh')
            if (!refreshToken) {
                isRefreshing = false
                processQueue(error, null)
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                window.location.href = '/login'
                return Promise.reject(error)
            }

            try {
                const { data } = await axios.post(
                    `${axiosInstance.defaults.baseURL}token/refresh/`,
                    { refresh: refreshToken }
                )
                const newAccess = data.data?.access || data.access
                localStorage.setItem('access', newAccess)
                axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccess}`
                processQueue(null, newAccess)
                originalRequest.headers.Authorization = `Bearer ${newAccess}`
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                processQueue(refreshError, null)
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

// Global error event for non-401 errors
let toastHandler = null

export function setGlobalErrorHandler(handler) {
    toastHandler = handler
}

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status !== 401 && toastHandler) {
            const data = error.response.data
            const message =
                data?.errors?.detail ||
                data?.detail ||
                (typeof data?.errors === 'string' ? data.errors : null) ||
                `Request failed (${error.response.status})`
            toastHandler(message)
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
