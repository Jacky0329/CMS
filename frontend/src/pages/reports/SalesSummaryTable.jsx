import { useMemo } from 'react'

export default function SalesSummaryTable({ data }) {
    const rows = useMemo(() => {
        const periodTotals = {}
        data.forEach((row) => {
            if (!periodTotals[row.period]) {
                periodTotals[row.period] = 0
            }
            periodTotals[row.period] += row.total
        })
        return { items: data, periodTotals }
    }, [data])

    if (data.length === 0) {
        return <div className="text-gray-500 py-4 text-center">No data to display.</div>
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Period</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Branch</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Total Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.items.map((row, i) => {
                        const isLastInPeriod =
                            i === rows.items.length - 1 || rows.items[i + 1]?.period !== row.period

                        return (
                            <>
                                <tr key={`${row.period}-${row.branch_id}`} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <td className="px-4 py-2 text-sm">{row.period}</td>
                                    <td className="px-4 py-2 text-sm">{row.branch_name}</td>
                                    <td className="px-4 py-2 text-sm text-right">
                                        ${Number(row.total).toLocaleString()}
                                    </td>
                                </tr>
                                {isLastInPeriod && (
                                    <tr key={`total-${row.period}`} className="border-t bg-blue-50 font-semibold">
                                        <td className="px-4 py-2 text-sm" colSpan="2">
                                            Total — {row.period}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-right">
                                            ${Number(rows.periodTotals[row.period]).toLocaleString()}
                                        </td>
                                    </tr>
                                )}
                            </>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
