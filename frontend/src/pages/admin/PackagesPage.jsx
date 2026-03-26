import { useCallback, useEffect, useState } from 'react'
import AdminFormModal from '../../components/AdminFormModal'
import {
    getCarModels,
    getPackages,
    createPackage,
    updatePackage,
    deactivatePackage,
    activatePackage,
    getItems,
    createItem,
    deleteItem,
} from '../../api/catalog'

export default function PackagesPage() {
    const [packages, setPackages] = useState([])
    const [carModels, setCarModels] = useState([])
    const [carModelFilter, setCarModelFilter] = useState('')
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editPkg, setEditPkg] = useState(null)
    const [expandedPkg, setExpandedPkg] = useState(null)
    const [items, setItems] = useState([])
    const [itemsLoading, setItemsLoading] = useState(false)
    const [showItemForm, setShowItemForm] = useState(false)

    const fetchCarModels = useCallback(async () => {
        const res = await getCarModels()
        setCarModels(res.data.data || [])
    }, [])

    const fetchPackages = useCallback(async () => {
        try {
            const params = {}
            if (carModelFilter) params.car_model = carModelFilter
            const res = await getPackages(params)
            setPackages(res.data.data || [])
        } finally {
            setLoading(false)
        }
    }, [carModelFilter])

    useEffect(() => {
        fetchCarModels()
    }, [fetchCarModels])

    useEffect(() => {
        fetchPackages()
    }, [fetchPackages])

    const fetchItems = useCallback(async (pkgId) => {
        setItemsLoading(true)
        try {
            const res = await getItems({ package: pkgId })
            setItems(res.data.data || [])
        } finally {
            setItemsLoading(false)
        }
    }, [])

    const handleExpand = (pkg) => {
        if (expandedPkg === pkg.id) {
            setExpandedPkg(null)
            setItems([])
        } else {
            setExpandedPkg(pkg.id)
            fetchItems(pkg.id)
        }
    }

    const handleCreate = async (data) => {
        await createPackage(data)
        setShowModal(false)
        fetchPackages()
    }

    const handleUpdate = async (data) => {
        await updatePackage(editPkg.id, data)
        setEditPkg(null)
        fetchPackages()
    }

    const handleToggleActive = async (pkg) => {
        if (pkg.is_active) {
            await deactivatePackage(pkg.id)
        } else {
            await activatePackage(pkg.id)
        }
        fetchPackages()
    }

    const handleAddItem = async (data) => {
        await createItem({ ...data, package: expandedPkg })
        setShowItemForm(false)
        fetchItems(expandedPkg)
    }

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Delete this item?')) return
        await deleteItem(itemId)
        fetchItems(expandedPkg)
    }

    const carModelOptions = carModels.map((m) => ({
        value: String(m.id),
        label: `${m.brand_name} ${m.name} (${m.year})`,
    }))

    const createFields = [
        {
            name: 'car_model',
            label: 'Car Model',
            type: 'select',
            options: carModelOptions,
            required: true,
        },
        { name: 'name', label: 'Package Name', required: true },
        { name: 'description', label: 'Description' },
        { name: 'price', label: 'Price', type: 'number', required: true, min: 0, step: '0.01' },
    ]

    const editFields = [
        { name: 'name', label: 'Package Name', required: true },
        { name: 'description', label: 'Description' },
        { name: 'price', label: 'Price', type: 'number', required: true, min: 0, step: '0.01' },
    ]

    const itemFields = [
        { name: 'name', label: 'Item Name', required: true },
        { name: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1 },
        { name: 'unit_price', label: 'Unit Price', type: 'number', required: true, min: 0, step: '0.01' },
    ]

    if (loading) return <div className="p-6">Loading packages...</div>

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Packages</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    New Package
                </button>
            </div>

            <div className="mb-4">
                <select
                    value={carModelFilter}
                    onChange={(e) => setCarModelFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">All Car Models</option>
                    {carModels.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.brand_name} {m.name} ({m.year})
                        </option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Car Model</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map((pkg) => (
                            <>
                                <tr key={pkg.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">{pkg.id}</td>
                                    <td className="px-4 py-3 text-sm">{pkg.car_model_name || pkg.car_model}</td>
                                    <td className="px-4 py-3 text-sm font-medium">{pkg.name}</td>
                                    <td className="px-4 py-3 text-sm">{pkg.price}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${pkg.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {pkg.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm space-x-2">
                                        <button
                                            onClick={() => handleExpand(pkg)}
                                            className="text-purple-600 hover:underline"
                                        >
                                            {expandedPkg === pkg.id ? 'Hide Items' : 'Items'}
                                        </button>
                                        <button
                                            onClick={() => setEditPkg(pkg)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(pkg)}
                                            className={`${pkg.is_active
                                                    ? 'text-red-600 hover:underline'
                                                    : 'text-green-600 hover:underline'
                                                }`}
                                        >
                                            {pkg.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedPkg === pkg.id && (
                                    <tr key={`items-${pkg.id}`} className="bg-gray-50">
                                        <td colSpan="6" className="px-8 py-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-semibold text-sm">Items</h3>
                                                <button
                                                    onClick={() => setShowItemForm(true)}
                                                    className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                >
                                                    Add Item
                                                </button>
                                            </div>
                                            {itemsLoading ? (
                                                <p className="text-sm text-gray-500">Loading items...</p>
                                            ) : items.length === 0 ? (
                                                <p className="text-sm text-gray-500">No items.</p>
                                            ) : (
                                                <table className="min-w-full bg-white border rounded text-sm">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="px-3 py-2 text-left">Name</th>
                                                            <th className="px-3 py-2 text-left">Qty</th>
                                                            <th className="px-3 py-2 text-left">Unit Price</th>
                                                            <th className="px-3 py-2 text-left">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {items.map((item) => (
                                                            <tr key={item.id} className="border-t">
                                                                <td className="px-3 py-2">{item.name}</td>
                                                                <td className="px-3 py-2">{item.quantity}</td>
                                                                <td className="px-3 py-2">{item.unit_price}</td>
                                                                <td className="px-3 py-2">
                                                                    <button
                                                                        onClick={() => handleDeleteItem(item.id)}
                                                                        className="text-red-600 hover:underline"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                        {packages.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                                    No packages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <AdminFormModal
                    title="New Package"
                    fields={createFields}
                    onSubmit={handleCreate}
                    onClose={() => setShowModal(false)}
                />
            )}

            {editPkg && (
                <AdminFormModal
                    title="Edit Package"
                    fields={editFields}
                    initialData={editPkg}
                    onSubmit={handleUpdate}
                    onClose={() => setEditPkg(null)}
                />
            )}

            {showItemForm && (
                <AdminFormModal
                    title="Add Item"
                    fields={itemFields}
                    onSubmit={handleAddItem}
                    onClose={() => setShowItemForm(false)}
                />
            )}
        </div>
    )
}
