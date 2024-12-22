import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    setIsAuthenticated(!!user)
  }, [])

  if (isAuthenticated === null) {
    // Optionally show a loader or return null while checking authentication
    return <div>Loading...</div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}
