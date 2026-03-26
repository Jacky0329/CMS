import axiosInstance from './axiosInstance'

export const getBrands = (params) => axiosInstance.get('brands/', { params })

export const getCarModels = (params) => axiosInstance.get('car-models/', { params })

export const getPackages = (params) => axiosInstance.get('packages/', { params })

export const createBrand = (data) => axiosInstance.post('brands/', data)

export const updateBrand = (id, data) => axiosInstance.patch(`brands/${id}/`, data)

export const deactivateBrand = (id) => axiosInstance.post(`brands/${id}/deactivate/`)

export const activateBrand = (id) => axiosInstance.post(`brands/${id}/activate/`)

export const createCarModel = (data) => axiosInstance.post('car-models/', data)

export const updateCarModel = (id, data) => axiosInstance.patch(`car-models/${id}/`, data)

export const deactivateCarModel = (id) => axiosInstance.post(`car-models/${id}/deactivate/`)

export const activateCarModel = (id) => axiosInstance.post(`car-models/${id}/activate/`)

export const createPackage = (data) => axiosInstance.post('packages/', data)

export const updatePackage = (id, data) => axiosInstance.patch(`packages/${id}/`, data)

export const deactivatePackage = (id) => axiosInstance.post(`packages/${id}/deactivate/`)

export const activatePackage = (id) => axiosInstance.post(`packages/${id}/activate/`)

export const getItems = (params) => axiosInstance.get('items/', { params })

export const createItem = (data) => axiosInstance.post('items/', data)

export const updateItem = (id, data) => axiosInstance.patch(`items/${id}/`, data)

export const deleteItem = (id) => axiosInstance.delete(`items/${id}/`)
