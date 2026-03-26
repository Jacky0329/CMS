import { useCallback, useEffect, useState } from 'react'
import CreateUserForm from './CreateUserForm'
import {
    getUsers,
    deactivateUser,
    activateUser,
    unlockUser,
} from '../../api/users'

export default function UsersPage() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)

    const fetchUsers = useCallback(async () => {
        try {
            const res = await getUsers()
            setUsers(res.data.data || [])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleToggleActive = async (user) => {
        if (user.is_active) {
            await deactivateUser(user.id)
        } else {
            await activateUser(user.id)
        }
        fetchUsers()
    }

    const handleUnlock = async (user) => {
        await unlockUser(user.id)
        fetchUsers()
    }

    if (loading) return <div className="p-6">Loading users...</div>

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Users</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    New User
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Username</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Branch</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm">{user.id}</td>
                                <td className="px-4 py-3 text-sm font-medium">{user.username}</td>
                                <td className="px-4 py-3 text-sm">{user.email}</td>
                                <td className="px-4 py-3 text-sm capitalize">{user.role}</td>
                                <td className="px-4 py-3 text-sm">{user.branch_name || '—'}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${user.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    {user.is_locked && (
                                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                                            Locked
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm space-x-2">
                                    <button
                                        onClick={() => handleToggleActive(user)}
                                        className={`${user.is_active
                                                ? 'text-red-600 hover:underline'
                                                : 'text-green-600 hover:underline'
                                            }`}
                                    >
                                        {user.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    {user.is_locked && (
                                        <button
                                            onClick={() => handleUnlock(user)}
                                            className="text-orange-600 hover:underline"
                                        >
                                            Unlock
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showCreate && (
                <CreateUserForm
                    onClose={() => setShowCreate(false)}
                    onCreated={() => {
                        setShowCreate(false)
                        fetchUsers()
                    }}
                />
            )}
        </div>
    )
}
