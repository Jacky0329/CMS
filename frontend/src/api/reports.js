import axiosInstance from './axiosInstance'

export const getSalesReport = (params) =>
    axiosInstance.get('reports/sales/', { params })
