import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const location = useLocation()

  useEffect(() => {
    const user = localStorage.getItem('user')
    setIsAuthenticated(!!user)
  }, [])

  if (isAuthenticated === null) {
    // Optionally show a loader or return null while checking authentication
    return <div>Loading...</div>
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />
  )
}
