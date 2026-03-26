import { useState } from 'react'
import { getBranches } from '../../api/branches'
import { createUser } from '../../api/users'
import { useEffect } from 'react'

export default function CreateUserForm({ onClose, onCreated }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
        branch: '',
    })
    const [branches, setBranches] = useState([])
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        getBranches().then((res) => setBranches(res.data.data || []))
    }, [])

    const handleChange = (name, value) => {
        setFormData((prev) => {
            const next = { ...prev, [name]: value }
            if (name === 'role' && value === 'admin') {
                next.branch = ''
            }
            return next
        })
        setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        if (formData.role === 'sales' && !formData.branch) {
            setErrors({ branch: 'Branch is required for Sales users.' })
            return
        }

        setSubmitting(true)
        try {
            const payload = { ...formData }
            if (payload.role === 'admin') {
                payload.branch = null
            }
            await createUser(payload)
            onCreated()
        } catch (err) {
            if (err.response?.data) {
                const apiErrors = err.response.data.errors || err.response.data
                if (typeof apiErrors === 'object') {
                    setErrors(apiErrors)
                }
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
                <h2 className="text-lg font-semibold mb-4">New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        {errors.username && (
                            <p className="text-red-600 text-sm mt-1">
                                {Array.isArray(errors.username) ? errors.username[0] : errors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">
                                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-600 text-sm mt-1">
                                {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                        >
                            <option value="">Select role...</option>
                            <option value="sales">Sales</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-600 text-sm mt-1">
                                {Array.isArray(errors.role) ? errors.role[0] : errors.role}
                            </p>
                        )}
                    </div>

                    {formData.role === 'sales' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                            <select
                                value={formData.branch}
                                onChange={(e) => handleChange('branch', e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                required
                            >
                                <option value="">Select branch...</option>
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                            {errors.branch && (
                                <p className="text-red-600 text-sm mt-1">
                                    {Array.isArray(errors.branch) ? errors.branch[0] : errors.branch}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
