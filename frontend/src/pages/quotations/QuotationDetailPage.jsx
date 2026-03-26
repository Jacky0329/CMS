import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getQuotation, confirmQuotation, cancelQuotation } from '../../api/quotations'
import StatusBadge from '../../components/StatusBadge'

export default function QuotationDetailPage() {
    const { id } = useParams()
    const [quotation, setQuotation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getQuotation(id)
            .then((res) => setQuotation(res.data.data || res.data))
            .finally(() => setLoading(false))
    }, [id])

    const handleConfirm = async () => {
        if (!window.confirm('Are you sure you want to confirm this quotation?')) return
        setActionLoading(true)
        try {
            const res = await confirmQuotation(id)
            setQuotation(res.data.data || res.data)
        } finally {
            setActionLoading(false)
        }
    }

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this quotation?')) return
        setActionLoading(true)
        try {
            const res = await cancelQuotation(id)
            setQuotation(res.data.data || res.data)
        } finally {
            setActionLoading(false)
        }
    }

    if (loading) return <p className="text-gray-500">Loading...</p>
    if (!quotation) return <p className="text-gray-500">Quotation not found.</p>

    return (
        <div>
            <div className="flex items-center justify-between mb-6 print:hidden">
                <h2 className="text-xl font-semibold">Quotation #{quotation.id}</h2>
                <div className="flex gap-2">
                    {quotation.status === 'draft' && (
                        <>
                            <Link
                                to="edit"
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={handleConfirm}
                                disabled={actionLoading}
                                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={actionLoading}
                                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 print:hidden"
                    >
                        Print
                    </button>
                </div>
            </div>

            <div className="print-area bg-white rounded-lg border p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase">Status</p>
                        <StatusBadge status={quotation.status} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase">Date</p>
                        <p>{new Date(quotation.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase">Branch</p>
                        <p>{quotation.branch?.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase">Sales User</p>
                        <p>{quotation.sales_user?.username}</p>
                    </div>
                </div>

                <hr />

                <div>
                    <h3 className="font-medium mb-2">Customer</h3>
                    <p>{quotation.customer?.full_name}</p>
                    <p className="text-sm text-gray-600">
                        {quotation.customer?.car_plate} &middot; {quotation.customer?.phone_number}
                    </p>
                </div>

                <hr />

                <div>
                    <h3 className="font-medium mb-2">Vehicle</h3>
                    <p>
                        {quotation.car_model?.brand_name} {quotation.car_model?.name} {quotation.car_model?.year}
                    </p>
                    <p className="text-sm text-gray-600">Package: {quotation.package?.name}</p>
                </div>

                {quotation.package?.items?.length > 0 && (
                    <>
                        <hr />
                        <div>
                            <h3 className="font-medium mb-2">Items</h3>
                            <table className="min-w-full text-sm border rounded">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Name</th>
                                        <th className="px-3 py-2 text-right">Qty</th>
                                        <th className="px-3 py-2 text-right">Unit Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotation.package.items.map((item, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="px-3 py-2">{item.name}</td>
                                            <td className="px-3 py-2 text-right">{item.quantity}</td>
                                            <td className="px-3 py-2 text-right">RM {item.unit_price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                <hr />

                <div>
                    <h3 className="font-medium mb-2">Price</h3>
                    <p className="text-2xl font-bold">RM {quotation.snapshot_price}</p>
                </div>
            </div>
        </div>
    )
}
