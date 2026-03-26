import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getQuotations } from '../../api/quotations'
import StatusBadge from '../../components/StatusBadge'

export default function QuotationsListPage() {
    const [quotations, setQuotations] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [debounced, setDebounced] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(search), 300)
        return () => clearTimeout(timer)
    }, [search])

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const params = {}
            if (debounced) params.search = debounced
            if (statusFilter) params.status = statusFilter
            const res = await getQuotations(params)
            setQuotations(res.data.data || [])
        } catch {
            setQuotations([])
        } finally {
            setLoading(false)
        }
    }, [debounced, statusFilter])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h2 className="text-xl font-semibold">Quotations</h2>
                <Link
                    to="new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm text-center"
                >
                    + New Quotation
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search customer name or car plate..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : quotations.length === 0 ? (
                <p className="text-gray-500">No quotations found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left p-3">ID</th>
                                <th className="text-left p-3">Customer</th>
                                <th className="text-left p-3 hidden sm:table-cell">Car Plate</th>
                                <th className="text-left p-3 hidden sm:table-cell">Car Model</th>
                                <th className="text-left p-3 hidden sm:table-cell">Package</th>
                                <th className="text-left p-3">Status</th>
                                <th className="text-right p-3">Price</th>
                                <th className="text-left p-3 hidden sm:table-cell">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotations.map((q) => (
                                <tr key={q.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">
                                        <Link to={`${q.id}`} className="text-blue-600 hover:underline">
                                            #{q.id}
                                        </Link>
                                    </td>
                                    <td className="p-3">{q.customer?.full_name}</td>
                                    <td className="p-3 hidden sm:table-cell">{q.customer?.car_plate}</td>
                                    <td className="p-3 hidden sm:table-cell">
                                        {q.car_model?.brand_name} {q.car_model?.name} {q.car_model?.year}
                                    </td>
                                    <td className="p-3 hidden sm:table-cell">{q.package?.name}</td>
                                    <td className="p-3"><StatusBadge status={q.status} /></td>
                                    <td className="p-3 text-right">{q.snapshot_price}</td>
                                    <td className="p-3 hidden sm:table-cell">
                                        {new Date(q.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
