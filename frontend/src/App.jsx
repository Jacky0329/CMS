import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import RoleRoute from './components/RoleRoute'
import LoginPage from './pages/auth/LoginPage'
import ForbiddenPage from './pages/ForbiddenPage'
import SalesDashboard from './pages/dashboard/SalesDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import QuotationsListPage from './pages/quotations/QuotationsListPage'
import NewQuotationForm from './pages/quotations/NewQuotationForm'
import QuotationDetailPage from './pages/quotations/QuotationDetailPage'
import EditQuotationForm from './pages/quotations/EditQuotationForm'
import CustomersListPage from './pages/customers/CustomersListPage'
import BranchesPage from './pages/admin/BranchesPage'
import BrandsPage from './pages/admin/BrandsPage'
import CarModelsPage from './pages/admin/CarModelsPage'
import PackagesPage from './pages/admin/PackagesPage'
import AdminQuotationsPage from './pages/admin/AdminQuotationsPage'
import UsersPage from './pages/admin/UsersPage'
import ReportsPage from './pages/reports/ReportsPage'
import { ToastProvider, useToast } from './context/ToastContext'
import { setGlobalErrorHandler } from './api/axiosInstance'
import { useEffect } from 'react'

function AxiosErrorBridge() {
    const { addToast } = useToast()
    useEffect(() => {
        setGlobalErrorHandler((msg) => addToast(msg, 'error'))
        return () => setGlobalErrorHandler(null)
    }, [addToast])
    return null
}

function App() {
    return (
        <ToastProvider>
            <AxiosErrorBridge />
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/403" element={<ForbiddenPage />} />

                        {/* Sales routes */}
                        <Route
                            path="/dashboard/sales"
                            element={
                                <PrivateRoute>
                                    <RoleRoute role="sales">
                                        <SalesDashboard />
                                    </RoleRoute>
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<Navigate to="quotations" replace />} />
                            <Route path="quotations" element={<QuotationsListPage />} />
                            <Route path="quotations/new" element={<NewQuotationForm />} />
                            <Route path="quotations/:id" element={<QuotationDetailPage />} />
                            <Route path="quotations/:id/edit" element={<EditQuotationForm />} />
                            <Route path="customers" element={<CustomersListPage />} />
                        </Route>

                        {/* Admin routes */}
                        <Route
                            path="/dashboard/admin"
                            element={
                                <PrivateRoute>
                                    <RoleRoute role="admin">
                                        <AdminDashboard />
                                    </RoleRoute>
                                </PrivateRoute>
                            }
                        >
                            <Route index element={<Navigate to="branches" replace />} />
                            <Route path="branches" element={<BranchesPage />} />
                            <Route path="brands" element={<BrandsPage />} />
                            <Route path="car-models" element={<CarModelsPage />} />
                            <Route path="packages" element={<PackagesPage />} />
                            <Route path="users" element={<UsersPage />} />
                            <Route path="quotations" element={<AdminQuotationsPage />} />
                            <Route path="quotations/:id" element={<QuotationDetailPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ToastProvider>
    )
}

export default App
