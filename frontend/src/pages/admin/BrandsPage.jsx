import { useCallback, useEffect, useState } from 'react'
import AdminFormModal from '../../components/AdminFormModal'
import {
    getBrands,
    createBrand,
    updateBrand,
    deactivateBrand,
    activateBrand,
} from '../../api/catalog'

export default function BrandsPage() {
    const [brands, setBrands] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editBrand, setEditBrand] = useState(null)

    const fetchBrands = useCallback(async () => {
        try {
            const res = await getBrands()
            setBrands(res.data.data || [])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBrands()
    }, [fetchBrands])

    const handleCreate = async (data) => {
        await createBrand(data)
        setShowModal(false)
        fetchBrands()
    }

    const handleUpdate = async (data) => {
        await updateBrand(editBrand.id, data)
        setEditBrand(null)
        fetchBrands()
    }

    const handleToggleActive = async (brand) => {
        if (brand.is_active) {
            await deactivateBrand(brand.id)
        } else {
            await activateBrand(brand.id)
        }
        fetchBrands()
    }

    const fields = [{ name: 'name', label: 'Brand Name', required: true }]

    if (loading) return <div className="p-6">Loading brands...</div>

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Brands</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    New Brand
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map((brand) => (
                            <tr key={brand.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm">{brand.id}</td>
                                <td className="px-4 py-3 text-sm font-medium">{brand.name}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${brand.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {brand.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm space-x-2">
                                    <button
                                        onClick={() => setEditBrand(brand)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(brand)}
                                        className={`${brand.is_active
                                                ? 'text-red-600 hover:underline'
                                                : 'text-green-600 hover:underline'
                                            }`}
                                    >
                                        {brand.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {brands.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                                    No brands found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <AdminFormModal
                    title="New Brand"
                    fields={fields}
                    onSubmit={handleCreate}
                    onClose={() => setShowModal(false)}
                />
            )}

            {editBrand && (
                <AdminFormModal
                    title="Edit Brand"
                    fields={fields}
                    initialData={editBrand}
                    onSubmit={handleUpdate}
                    onClose={() => setEditBrand(null)}
                />
            )}
        </div>
    )
}
