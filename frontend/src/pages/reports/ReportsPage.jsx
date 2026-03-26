import { useCallback, useEffect, useState } from 'react'
import { getSalesReport } from '../../api/reports'
import SalesBarChart from './SalesBarChart'
import SalesSummaryTable from './SalesSummaryTable'

export default function ReportsPage() {
    const [period, setPeriod] = useState('monthly')
    const [year, setYear] = useState(new Date().getFullYear())
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const currentYear = new Date().getFullYear()
    const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i)

    const fetchReport = useCallback(async () => {
        setLoading(true)
        try {
            const params = { period }
            if (period === 'monthly') params.year = year
            const res = await getSalesReport(params)
            setData(res.data.data || [])
        } finally {
            setLoading(false)
        }
    }, [period, year])

    useEffect(() => {
        fetchReport()
    }, [fetchReport])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Sales Reports</h1>

            <div className="flex gap-3 mb-6">
                <div className="flex rounded border border-gray-300 overflow-hidden">
                    <button
                        onClick={() => setPeriod('monthly')}
                        className={`px-4 py-2 text-sm ${period === 'monthly'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setPeriod('yearly')}
                        className={`px-4 py-2 text-sm ${period === 'yearly'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Yearly
                    </button>
                </div>

                {period === 'monthly' && (
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="border border-gray-300 rounded px-3 py-2"
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {loading ? (
                <div className="py-8 text-center text-gray-500">Loading report...</div>
            ) : (
                <div className="space-y-8">
                    <div className="bg-white rounded-lg border p-4">
                        <h2 className="text-lg font-semibold mb-4">Revenue Chart</h2>
                        <SalesBarChart data={data} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Revenue Summary</h2>
                        <SalesSummaryTable data={data} />
                    </div>
                </div>
            )}
        </div>
    )
}
