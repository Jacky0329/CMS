import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function NavBar() {
    const { user, role, branchName, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <header className="bg-white border-b h-16 flex items-center justify-between px-6">
            <h1 className="font-semibold text-lg">Car Management System</h1>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                    {user}
                    {role === 'sales' && branchName && (
                        <span className="ml-2 text-gray-400">({branchName})</span>
                    )}
                    {role === 'admin' && (
                        <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
                            Admin
                        </span>
                    )}
                </span>
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}
