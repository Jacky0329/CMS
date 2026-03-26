import axiosInstance from './axiosInstance'

export const getBranches = (params) => axiosInstance.get('branches/', { params })

export const createBranch = (data) => axiosInstance.post('branches/', data)

export const updateBranch = (id, data) => axiosInstance.patch(`branches/${id}/`, data)

export const deactivateBranch = (id) => axiosInstance.post(`branches/${id}/deactivate/`)

export const activateBranch = (id) => axiosInstance.post(`branches/${id}/activate/`)
