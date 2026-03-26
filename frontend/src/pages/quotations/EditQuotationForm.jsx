import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getQuotation, updateQuotation } from '../../api/quotations'
import { getBrands, getCarModels, getPackages } from '../../api/catalog'
import { getCustomers } from '../../api/customers'

export default function EditQuotationForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [quotation, setQuotation] = useState(null)
    const [loading, setLoading] = useState(true)

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

    useEffect(() => {
        const load = async () => {
            try {
                const [qRes, bRes] = await Promise.all([
                    getQuotation(id),
                    getBrands({ is_active: true }),
                ])
                const q = qRes.data.data || qRes.data
                setQuotation(q)
                setBrands(bRes.data.data || [])

                setCustomerId(q.customer?.id)
                setCustomerSearch(q.customer?.full_name || '')

                const bId = q.car_model?.brand || q.car_model?.brand_name
                // Find brand ID from car_model
                const cmRes = await getCarModels({ brand: '' })
                const allModels = cmRes.data.data || []
                const thisModel = allModels.find((m) => m.id === q.car_model?.id)
                const foundBrandId = thisModel?.brand || ''

                setBrandId(foundBrandId)
                if (foundBrandId) {
                    const modelsRes = await getCarModels({ brand: foundBrandId, is_active: true })
                    setCarModels(modelsRes.data.data || [])
                }
                setCarModelId(q.car_model?.id || '')

                if (q.car_model?.id) {
                    const pkgRes = await getPackages({ car_model: q.car_model.id, is_active: true })
                    setPackages(pkgRes.data.data || [])
                }
                setPackageId(q.package?.id || '')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    useEffect(() => {
        if (brandId && !loading) {
            getCarModels({ brand: brandId, is_active: true }).then((res) => setCarModels(res.data.data || []))
        }
    }, [brandId, loading])

    useEffect(() => {
        if (carModelId && !loading) {
            getPackages({ car_model: carModelId, is_active: true }).then((res) => setPackages(res.data.data || []))
        }
    }, [carModelId, loading])

    useEffect(() => {
        if (customerSearch.length >= 2) {
            const timer = setTimeout(() => {
                getCustomers({ search: customerSearch }).then((res) => setCustomers(res.data.data || []))
            }, 300)
            return () => clearTimeout(timer)
        } else {
            setCustomers([])
        }
    }, [customerSearch])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)
        try {
            await updateQuotation(id, {
                customer: parseInt(customerId),
                car_model: parseInt(carModelId),
                package: parseInt(packageId),
            })
            navigate(`../${id}`, { replace: true, relative: 'path' })
        } catch (err) {
            const errors = err.response?.data?.errors || err.response?.data || {}
            setError(typeof errors === 'string' ? errors : JSON.stringify(errors))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) return <p className="text-gray-500">Loading...</p>
    if (!quotation) return <p className="text-gray-500">Quotation not found.</p>
    if (quotation.status !== 'draft') {
        return <p className="text-gray-500">Only draft quotations can be edited.</p>
    }

    return (
        <div className="max-w-lg">
            <h2 className="text-xl font-semibold mb-6">Edit Quotation #{id}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{error}</div>}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <select
                        value={brandId}
                        onChange={(e) => {
                            setBrandId(e.target.value)
                            setCarModelId('')
                            setPackageId('')
                        }}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">Select brand...</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Model</label>
                    <select
                        value={carModelId}
                        onChange={(e) => {
                            setCarModelId(e.target.value)
                            setPackageId('')
                        }}
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <input
                        type="text"
                        placeholder="Search customer..."
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
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || !customerId || !packageId}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`../${id}`, { relative: 'path' })}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
