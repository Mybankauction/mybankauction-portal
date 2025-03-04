import { useEffect, useState } from 'react'

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const user = localStorage.getItem('user')
    return user ? (JSON.parse(user)?.id ? true : false) : false
  })
  useEffect(() => {
    const handleStorageChange = () => {
      const _user = localStorage.getItem('user')
      setIsLoggedIn(_user ? (JSON.parse(_user)?.id ? true : false) : false)
    }
    window.addEventListener('storage', handleStorageChange)

    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return isLoggedIn
}
