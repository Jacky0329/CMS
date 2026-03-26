import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBrands, getCarModels, getPackages } from '../../api/catalog'
import { getCustomers, createCustomer } from '../../api/customers'
import { createQuotation } from '../../api/quotations'

export default function NewQuotationForm() {
    const navigate = useNavigate()
    const [brands, setBrands] = useState([])
    const [carModels, setCarModels] = useState([])
    const [packages, setPackages] = useState([])
    const [customers, setCustomers] = useState([])
    const [customerSearch, setCustomerSearch] = useState('')

    const [brandId, setBrandId] = useState('')
    const [carModelId, setCarModelId] = useState('')
    const [packageId, setPackageId] = useState('')
    const [customerId, setCustomerId] = useState('')

    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // New customer modal state
    const [showNewCustomer, setShowNewCustomer] = useState(false)
    const [newCustomer, setNewCustomer] = useState({ full_name: '', car_plate: '', phone_number: '' })
    const [customerErrors, setCustomerErrors] = useState({})

    useEffect(() => {
        getBrands({ is_active: true }).then((res) => setBrands(res.data.data || []))
    }, [])

    useEffect(() => {
        if (brandId) {
            getCarModels({ brand: brandId, is_active: true }).then((res) => setCarModels(res.data.data || []))
        } else {
            setCarModels([])
        }
        setCarModelId('')
        setPackageId('')
    }, [brandId])

    useEffect(() => {
        if (carModelId) {
            getPackages({ car_model: carModelId, is_active: true }).then((res) => setPackages(res.data.data || []))
        } else {
            setPackages([])
        }
        setPackageId('')
    }, [carModelId])

    const searchCustomers = useCallback(async (text) => {
        if (text.length < 2) {
            setCustomers([])
            return
        }
        try {
            const res = await getCustomers({ search: text })
            setCustomers(res.data.data || [])
        } catch {
            setCustomers([])
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => searchCustomers(customerSearch), 300)
        return () => clearTimeout(timer)
    }, [customerSearch, searchCustomers])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)
        try {
            const res = await createQuotation({
                customer: parseInt(customerId),
                car_model: parseInt(carModelId),
                package: parseInt(packageId),
            })
            const id = res.data.data?.id || res.data.id
            navigate(`../${id}`, { replace: true, relative: 'path' })
        } catch (err) {
            const errors = err.response?.data?.errors || err.response?.data || {}
            setError(typeof errors === 'string' ? errors : JSON.stringify(errors))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCreateCustomer = async () => {
        setCustomerErrors({})
        try {
            const res = await createCustomer(newCustomer)
            const created = res.data.data || res.data
            setCustomerId(created.id)
            setCustomerSearch(created.full_name)
            setShowNewCustomer(false)
            setNewCustomer({ full_name: '', car_plate: '', phone_number: '' })
        } catch (err) {
            setCustomerErrors(err.response?.data?.errors || err.response?.data || {})
        }
    }

    return (
        <div className="max-w-lg">
            <h2 className="text-xl font-semibold mb-6">New Quotation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}

                {/* Brand */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <select
                        value={brandId}
                        onChange={(e) => setBrandId(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">Select brand...</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                {/* Car Model */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Model</label>
                    <select
                        value={carModelId}
                        onChange={(e) => setCarModelId(e.target.value)}
                        required
                        disabled={!brandId}
                        className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                    >
                        <option value="">Select car model...</option>
                        {carModels.map((m) => (
                            <option key={m.id} value={m.id}>{m.name} {m.year}</option>
                        ))}
                    </select>
                </div>

                {/* Package */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Package</label>
                    <select
                        value={packageId}
                        onChange={(e) => setPackageId(e.target.value)}
                        required
                        disabled={!carModelId}
                        className="w-full border border-gray-300 rounded px-3 py-2 disabled:bg-gray-100"
                    >
                        <option value="">Select package...</option>
                        {packages.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} — RM {p.price}</option>
                        ))}
                    </select>
                </div>

                {/* Customer */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <input
                        type="text"
                        placeholder="Search customer by name or car plate..."
                        value={customerSearch}
                        onChange={(e) => {
                            setCustomerSearch(e.target.value)
                            setCustomerId('')
                        }}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    {customers.length > 0 && !customerId && (
                        <ul className="border border-gray-200 rounded mt-1 max-h-40 overflow-y-auto bg-white">
                            {customers.map((c) => (
                                <li
                                    key={c.id}
                                    onClick={() => {
                                        setCustomerId(c.id)
                                        setCustomerSearch(c.full_name)
                                        setCustomers([])
                                    }}
                                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                                >
                                    {c.full_name} — {c.car_plate}
                                </li>
                            ))}
                        </ul>
                    )}
                    <button
                        type="button"
                        onClick={() => setShowNewCustomer(true)}
                        className="text-sm text-blue-600 hover:underline mt-1"
                    >
                        + New Customer
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !customerId || !packageId}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating...' : 'Create Quotation'}
                </button>
            </form>

            {/* New Customer Modal */}
            {showNewCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">New Customer</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={newCustomer.full_name}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, full_name: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                                {customerErrors.full_name && (
                                    <p className="text-red-600 text-xs mt-1">{customerErrors.full_name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Car Plate</label>
                                <input
                                    type="text"
                                    value={newCustomer.car_plate}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, car_plate: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                                {customerErrors.car_plate && (
                                    <p className="text-red-600 text-xs mt-1">{customerErrors.car_plate}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={newCustomer.phone_number}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, phone_number: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                                {customerErrors.phone_number && (
                                    <p className="text-red-600 text-xs mt-1">{customerErrors.phone_number}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowNewCustomer(false)}
                                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateCustomer}
                                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                                Create Customer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
