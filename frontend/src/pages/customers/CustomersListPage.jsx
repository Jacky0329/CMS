import { useCallback, useEffect, useState } from 'react'
import { getCustomers, updateCustomer } from '../../api/customers'
import AddCustomerForm from './AddCustomerForm'

export default function CustomersListPage() {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [debounced, setDebounced] = useState('')
    const [showAdd, setShowAdd] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editData, setEditData] = useState({})

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(search), 300)
        return () => clearTimeout(timer)
    }, [search])

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const params = {}
            if (debounced) params.search = debounced
            const res = await getCustomers(params)
            setCustomers(res.data.data || [])
        } catch {
            setCustomers([])
        } finally {
            setLoading(false)
        }
    }, [debounced])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleSaveEdit = async (id) => {
        try {
            await updateCustomer(id, editData)
            setEditingId(null)
            fetchData()
        } catch {
            // errors handled inline
        }
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold">Customers</h2>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                    + Add Customer
                </button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name or car plate..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm w-full max-w-md"
                />
            </div>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : customers.length === 0 ? (
                <p className="text-gray-500">No customers found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left p-3">Name</th>
                                <th className="text-left p-3">Car Plate</th>
                                <th className="text-left p-3">Phone</th>
                                <th className="text-left p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c) => (
                                <tr key={c.id} className="border-b hover:bg-gray-50">
                                    {editingId === c.id ? (
                                        <>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={editData.full_name || ''}
                                                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                                                />
                                            </td>
                                            <td className="p-3 text-gray-500">{c.car_plate}</td>
                                            <td className="p-3">
                                                <input
                                                    type="text"
                                                    value={editData.phone_number || ''}
                                                    onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                                                />
                                            </td>
                                            <td className="p-3 flex gap-1">
                                                <button
                                                    onClick={() => handleSaveEdit(c.id)}
                                                    className="text-green-600 hover:underline text-sm"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-gray-500 hover:underline text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-3">{c.full_name}</td>
                                            <td className="p-3">{c.car_plate}</td>
                                            <td className="p-3">{c.phone_number}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(c.id)
                                                        setEditData({ full_name: c.full_name, phone_number: c.phone_number })
                                                    }}
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showAdd && (
                <AddCustomerForm
                    onClose={() => setShowAdd(false)}
                    onCreated={() => {
                        setShowAdd(false)
                        fetchData()
                    }}
                />
            )}
        </div>
    )
}
