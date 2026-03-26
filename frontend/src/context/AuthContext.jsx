import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import axiosInstance from '../api/axiosInstance'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [branchId, setBranchId] = useState(null)
    const [branchName, setBranchName] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const access = localStorage.getItem('access')
        if (access) {
            try {
                const decoded = jwtDecode(access)
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(decoded.username || decoded.user_id)
                    setRole(localStorage.getItem('role'))
                    setBranchId(localStorage.getItem('branchId'))
                    setBranchName(localStorage.getItem('branchName'))
                } else {
                    localStorage.removeItem('access')
                    localStorage.removeItem('refresh')
                }
            } catch {
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
            }
        }
        setIsLoading(false)
    }, [])

    const login = useCallback(async (username, password) => {
        const { data } = await axiosInstance.post('token/', { username, password })
        const payload = data.data || data
        localStorage.setItem('access', payload.access)
        localStorage.setItem('refresh', payload.refresh)
        localStorage.setItem('role', payload.role)
        localStorage.setItem('branchId', payload.branch_id || '')
        localStorage.setItem('branchName', payload.branch_name || '')
        setUser(username)
        setRole(payload.role)
        setBranchId(payload.branch_id)
        setBranchName(payload.branch_name)
        return payload
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('role')
        localStorage.removeItem('branchId')
        localStorage.removeItem('branchName')
        setUser(null)
        setRole(null)
        setBranchId(null)
        setBranchName(null)
    }, [])

    const value = useMemo(
        () => ({ user, role, branchId, branchName, isLoading, login, logout }),
        [user, role, branchId, branchName, isLoading, login, logout]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
