import { useState } from 'react'

export default function AdminFormModal({ title, fields, initialData = {}, onSubmit, onClose }) {
    const [formData, setFormData] = useState(() => {
        const init = {}
        fields.forEach((f) => {
            init[f.name] = initialData[f.name] ?? f.defaultValue ?? ''
        })
        return init
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setErrors({})
        try {
            await onSubmit(formData)
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
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.label}
                            </label>
                            {field.type === 'select' ? (
                                <select
                                    value={formData[field.name]}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required={field.required}
                                    disabled={field.disabled}
                                >
                                    <option value="">Select...</option>
                                    {(field.options || []).map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type || 'text'}
                                    value={formData[field.name]}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required={field.required}
                                    disabled={field.disabled}
                                    placeholder={field.placeholder || ''}
                                    min={field.min}
                                    max={field.max}
                                    step={field.step}
                                />
                            )}
                            {errors[field.name] && (
                                <p className="text-red-600 text-sm mt-1">
                                    {Array.isArray(errors[field.name])
                                        ? errors[field.name][0]
                                        : errors[field.name]}
                                </p>
                            )}
                        </div>
                    ))}
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
                            {submitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
