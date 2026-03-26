import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'error') => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 5000)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    return useContext(ToastContext)
}

function ToastContainer({ toasts, onRemove }) {
    if (toasts.length === 0) return null

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm flex items-start gap-2 ${toast.type === 'error'
                            ? 'bg-red-600'
                            : toast.type === 'success'
                                ? 'bg-green-600'
                                : 'bg-blue-600'
                        }`}
                >
                    <span className="flex-1">{toast.message}</span>
                    <button
                        onClick={() => onRemove(toast.id)}
                        className="text-white/80 hover:text-white font-bold"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    )
}
