import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../../components/StatusBadge'
import { getQuotations } from '../../api/quotations'
import { getBranches } from '../../api/branches'

export default function AdminQuotationsPage() {
    const [quotations, setQuotations] = useState([])
    const [branches, setBranches] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [branchFilter, setBranchFilter] = useState('')
    const navigate = useNavigate()

    const fetchBranches = useCallback(async () => {
        const res = await getBranches()
        setBranches(res.data.data || [])
    }, [])

    const fetchQuotations = useCallback(async () => {
        try {
            const params = {}
            if (search) params.search = search
            if (statusFilter) params.status = statusFilter
            if (branchFilter) params.branch = branchFilter
            const res = await getQuotations(params)
            setQuotations(res.data.data || [])
        } finally {
            setLoading(false)
        }
    }, [search, statusFilter, branchFilter])

    useEffect(() => {
        fetchBranches()
    }, [fetchBranches])

    useEffect(() => {
        const timer = setTimeout(() => fetchQuotations(), 300)
        return () => clearTimeout(timer)
    }, [fetchQuotations])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Quotations</h1>

            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search customer name or plate..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-64"
                />
                <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">All Branches</option>
                    {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    <option value="">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {loading ? (
                <div>Loading quotations...</div>
            ) : quotations.length === 0 ? (
                <div className="text-gray-500">No quotations found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Branch</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden sm:table-cell">Car Model</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Package</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden lg:table-cell">Sales User</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotations.map((q) => (
                                <tr
                                    key={q.id}
                                    className="border-t hover:bg-gray-50 cursor-pointer"
                                    onClick={() => navigate(`/dashboard/admin/quotations/${q.id}`)}
                                >
                                    <td className="px-4 py-3 text-sm">{q.id}</td>
                                    <td className="px-4 py-3 text-sm">{q.branch?.name}</td>
                                    <td className="px-4 py-3 text-sm">{q.customer?.full_name}</td>
                                    <td className="px-4 py-3 text-sm hidden sm:table-cell">
                                        {q.car_model?.brand_name} {q.car_model?.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm hidden md:table-cell">{q.package?.name}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <StatusBadge status={q.status} />
                                    </td>
                                    <td className="px-4 py-3 text-sm">{q.snapshot_price}</td>
                                    <td className="px-4 py-3 text-sm hidden lg:table-cell">{q.sales_user?.username}</td>
                                    <td className="px-4 py-3 text-sm hidden md:table-cell">
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
