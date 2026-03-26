import axiosInstance from './axiosInstance'

export const getQuotations = (params) => axiosInstance.get('quotations/', { params })

export const createQuotation = (data) => axiosInstance.post('quotations/', data)

export const getQuotation = (id) => axiosInstance.get(`quotations/${id}/`)

export const updateQuotation = (id, data) => axiosInstance.patch(`quotations/${id}/`, data)

export const confirmQuotation = (id) => axiosInstance.post(`quotations/${id}/confirm/`)

export const cancelQuotation = (id) => axiosInstance.post(`quotations/${id}/cancel/`)
