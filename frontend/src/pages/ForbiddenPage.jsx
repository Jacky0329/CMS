import { Link } from 'react-router-dom'

export default function ForbiddenPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
            <p className="text-gray-600 mb-6">You do not have permission to access this page.</p>
            <Link to="/login" className="text-blue-600 hover:underline">
                Back to Login
            </Link>
        </div>
    )
}
