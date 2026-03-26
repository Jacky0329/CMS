import axiosInstance from './axiosInstance'

export const getUsers = (params) => axiosInstance.get('users/', { params })

export const createUser = (data) => axiosInstance.post('users/', data)

export const updateUser = (id, data) => axiosInstance.patch(`users/${id}/`, data)

export const deactivateUser = (id) => axiosInstance.post(`users/${id}/deactivate/`)

export const activateUser = (id) => axiosInstance.post(`users/${id}/activate/`)

export const unlockUser = (id) => axiosInstance.post(`users/${id}/unlock/`)
