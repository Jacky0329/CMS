import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import NavBar from '../../components/NavBar'

const navLinks = [
    { to: '/dashboard/sales/quotations', label: 'Quotations' },
    { to: '/dashboard/sales/customers', label: 'Customers' },
]

export default function SalesDashboard() {
    const { branchName } = useAuth()
    const [mobileNav, setMobileNav] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="sm:hidden p-2 border-b bg-white">
                <button
                    onClick={() => setMobileNav(!mobileNav)}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                    ☰ Menu
                </button>
                {mobileNav && (
                    <nav className="mt-2 space-y-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileNav(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded text-sm ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                )}
            </div>
            <div className="flex">
                <aside className="w-56 bg-white border-r min-h-[calc(100vh-4rem)] p-4 hidden sm:block">
                    <p className="text-xs text-gray-400 uppercase mb-4">Branch: {branchName}</p>
                    <nav className="space-y-1">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded text-sm ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
