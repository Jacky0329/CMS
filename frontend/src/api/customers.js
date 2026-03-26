import axiosInstance from './axiosInstance'

export const getCustomers = (params) => axiosInstance.get('customers/', { params })

export const createCustomer = (data) => axiosInstance.post('customers/', data)

export const getCustomer = (id) => axiosInstance.get(`customers/${id}/`)

export const updateCustomer = (id, data) => axiosInstance.patch(`customers/${id}/`, data)
