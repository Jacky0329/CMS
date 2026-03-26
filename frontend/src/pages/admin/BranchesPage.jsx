import { useCallback, useEffect, useState } from 'react'
import AdminFormModal from '../../components/AdminFormModal'
import {
    getBranches,
    createBranch,
    updateBranch,
    deactivateBranch,
    activateBranch,
} from '../../api/branches'

export default function BranchesPage() {
    const [branches, setBranches] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editBranch, setEditBranch] = useState(null)

    const fetchBranches = useCallback(async () => {
        try {
            const res = await getBranches()
            setBranches(res.data.data || [])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchBranches()
    }, [fetchBranches])

    const handleCreate = async (data) => {
        await createBranch(data)
        setShowModal(false)
        fetchBranches()
    }

    const handleUpdate = async (data) => {
        await updateBranch(editBranch.id, data)
        setEditBranch(null)
        fetchBranches()
    }

    const handleToggleActive = async (branch) => {
        if (branch.is_active) {
            await deactivateBranch(branch.id)
        } else {
            await activateBranch(branch.id)
        }
        fetchBranches()
    }

    const fields = [
        { name: 'name', label: 'Branch Name', required: true },
        { name: 'location', label: 'Location', required: true },
    ]

    if (loading) return <div className="p-6">Loading branches...</div>

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Branches</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    New Branch
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {branches.map((branch) => (
                            <tr key={branch.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm">{branch.id}</td>
                                <td className="px-4 py-3 text-sm font-medium">{branch.name}</td>
                                <td className="px-4 py-3 text-sm">{branch.location}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${branch.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {branch.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm space-x-2">
                                    <button
                                        onClick={() => setEditBranch(branch)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggleActive(branch)}
                                        className={`${branch.is_active
                                                ? 'text-red-600 hover:underline'
                                                : 'text-green-600 hover:underline'
                                            }`}
                                    >
                                        {branch.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {branches.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                                    No branches found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <AdminFormModal
                    title="New Branch"
                    fields={fields}
                    onSubmit={handleCreate}
                    onClose={() => setShowModal(false)}
                />
            )}

            {editBranch && (
                <AdminFormModal
                    title="Edit Branch"
                    fields={fields}
                    initialData={editBranch}
                    onSubmit={handleUpdate}
                    onClose={() => setEditBranch(null)}
                />
            )}
        </div>
    )
}
