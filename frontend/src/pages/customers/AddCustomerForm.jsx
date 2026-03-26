import { useState } from 'react'
import { createCustomer } from '../../api/customers'

export default function AddCustomerForm({ onClose, onCreated }) {
    const [form, setForm] = useState({ full_name: '', car_plate: '', phone_number: '' })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        setIsSubmitting(true)
        try {
            const res = await createCustomer(form)
            const created = res.data.data || res.data
            onCreated(created)
        } catch (err) {
            const apiErrors = err.response?.data?.errors || err.response?.data || {}
            setErrors(apiErrors)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4">Add Customer</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={form.full_name}
                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.full_name && <p className="text-red-600 text-xs mt-1">{errors.full_name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Car Plate</label>
                        <input
                            type="text"
                            value={form.car_plate}
                            onChange={(e) => setForm({ ...form, car_plate: e.target.value })}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.car_plate && <p className="text-red-600 text-xs mt-1">{errors.car_plate}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            value={form.phone_number}
                            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        {errors.phone_number && <p className="text-red-600 text-xs mt-1">{errors.phone_number}</p>}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
