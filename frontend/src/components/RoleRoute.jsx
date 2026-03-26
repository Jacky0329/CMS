import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RoleRoute({ role, children }) {
    const { role: userRole, isLoading } = useAuth()

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (userRole !== role) {
        return <Navigate to="/403" replace />
    }

    return children
}
