import { SERVER_URL } from '@/conf'
import { useEffect, useState } from 'react'

const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('accessToken') || ''
  )

  const refreshToken = async () => {
    try {
      const now = Date.now()
      const lastRefreshTime = parseInt(
        localStorage.getItem('lastRefreshTime') || '0',
        10
      )

      // Check if 55 minutes (3300 seconds) have passed since the last refresh
      if (lastRefreshTime && now - lastRefreshTime < 3300 * 1000) {
        // console.log('Token still valid, skipping refresh')
        return
      }

      const res = await fetch(`${SERVER_URL}/api/zoho/token`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to fetch new token')
      const data = await res.json()

      setAccessToken(data.access_token)
      localStorage.setItem('accessToken', data.access_token)
      localStorage.setItem('lastRefreshTime', now.toString())
    } catch (error) {
      console.error('Error refreshing token:', error)
    }
  }

  useEffect(() => {
    // Refresh the token immediately if accessToken is empty
    refreshToken()

    // Set an interval to refresh the token every 55 minutes
    const interval = setInterval(refreshToken, 3300 * 1000)

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  return accessToken
}

export default useAccessToken
