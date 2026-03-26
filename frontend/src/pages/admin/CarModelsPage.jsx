import { useCallback, useEffect, useState } from 'react'
import AdminFormModal from '../../components/AdminFormModal'
import {
    getBrands,
    getCarModels,
    createCarModel,
    updateCarModel,
    deactivateCarModel,
    activateCarModel,
} from '../../api/catalog'

export default function CarModelsPage() {
    const [carModels, setCarModels] = useState([])
    const [brands, setBrands] = useState([])
    const [brandFilter, setBrandFilter] = useState('')
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editModel, setEditModel] = useState(null)

    const fetchBrands = useCallback(async () => {
        const res = await getBrands()
        setBrands(res.data.data || [])
    }, [])

    const fetchCarModels = useCallback(async () => {
        try {
            const params = {}
            if (brandFilter) params.brand = brandFilter
            const res = await getCarModels(params)
            setCarModels(res.data.data || [])
        } finally {
            setLoading(false)
        }
    }, [brandFilter])

    useEffect(() => {
        fetchBrands()
    }, [fetchBrands])

    useEffect(() => {
        fetchCarModels()
    }, [fetchCarModels])

    const handleCreate = async (data) => {
        await createCarModel(data)
        setShowModal(false)
        fetchCarModels()
    }

    const handleUpdate = async (data) => {
        await updateCarModel(editModel.id, data)
        setEditModel(null)
        fetchCarModels()
    }

    const handleToggleActive = async (model) => {
        if (model.is_active) {
            await deactivateCarModel(model.id)
        } else {
            await activateCarModel(model.id)
        }
        fetchCarModels()
    }

    const brandOptions = brands.map((b) => ({ value: String(b.id), label: b.name }))

    const createFields = [
        { name: 'brand', label: 'Brand', type: 'select', options: brandOptions, required: true },
        { name: 'name', label: 'Model Name', required: true },
        { name: 'year', label: 'Year', type: 'number', required: true, min: 1900, max: 2100 },
    ]

    const editFields = [
        { name: 'name', label: 'Model Name', required: true },
        { name: 'year', label: 'Year', type: 'number', required: true, min: 1900, max: 2100 },
    ]

    if (loading) return <div className="p-6">Loading car models...</div>

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Car Models</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    New Car Model
                </button>
            </div>

            <div className="mb-4">
                <select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">All Brands</option>
                    {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Brand</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Year</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carModels.map((model) => (
                            <tr key={model.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm">{model.id}</td>
                                <td className="px-4 py-3 text-sm">{model.brand_name}</td>
                                <td className="px-4 py-3 text-sm font-medium">{model.name}</td>
                                <td className="px-4 py-3 text-sm">{model.year}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${model.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {model.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm space-x-2">
                                    <button
                                        onClick={() => setEditModel(model)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(model)}
                                        className={`${model.is_active
                                                ? 'text-red-600 hover:underline'
                                                : 'text-green-600 hover:underline'
                                            }`}
                                    >
                                        {model.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {carModels.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                                    No car models found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <AdminFormModal
                    title="New Car Model"
                    fields={createFields}
                    onSubmit={handleCreate}
                    onClose={() => setShowModal(false)}
                />
            )}

            {editModel && (
                <AdminFormModal
                    title="Edit Car Model"
                    fields={editFields}
                    initialData={editModel}
                    onSubmit={handleUpdate}
                    onClose={() => setEditModel(null)}
                />
            )}
        </div>
    )
}
