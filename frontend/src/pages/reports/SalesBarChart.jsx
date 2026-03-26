import { useMemo } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

const COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
]

export default function SalesBarChart({ data }) {
    const { chartData, branchNames } = useMemo(() => {
        const periodMap = {}
        const branchSet = new Set()

        data.forEach((row) => {
            if (!periodMap[row.period]) {
                periodMap[row.period] = { period: row.period }
            }
            periodMap[row.period][row.branch_name] = row.total
            branchSet.add(row.branch_name)
        })

        return {
            chartData: Object.values(periodMap),
            branchNames: Array.from(branchSet),
        }
    }, [data])

    if (chartData.length === 0) {
        return <div className="text-gray-500 py-8 text-center">No data to display.</div>
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                {branchNames.map((name, i) => (
                    <Bar
                        key={name}
                        dataKey={name}
                        fill={COLORS[i % COLORS.length]}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    )
}
