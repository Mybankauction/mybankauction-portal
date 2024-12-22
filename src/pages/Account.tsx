import { triggerAuthUpdate } from '@/utils/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Account() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedin')
    localStorage.removeItem('interestedDeals')
    triggerAuthUpdate()
    setUser(null)
    navigate('/login')
  }

  useEffect(() => {
    try {
      const _user = JSON.parse(localStorage.getItem('user') || 'null')
      if (_user) {
        setUser(_user)
      } else {
        navigate('/login') // Redirect if no user is found
      }
    } catch (error) {
      console.error('Failed to parse user data:', error)
      navigate('/login') // Redirect in case of an error
    }
  }, [navigate])

  return (
    <section className='grid place-content-center flex-col'>
      <h1 className='text-4xl font-bold my-10'>Account</h1>
      <div className='my-10'>
        <p>Name</p>
        <p className='text-2xl'>{user?.Name1 || 'NA'}</p>
      </div>
      <div>
        <p>Email</p>
        <p className='text-2xl'>{user?.Email || 'NA'}</p>
      </div>
      <div className='my-10'>
        <p>Phone Number</p>
        <p className='text-2xl'>{user?.Phone || 'NA'}</p>
      </div>
      <div>
        <button
          className='bg-red-600 py-2 px-4 rounded-sm text-white'
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </section>
  )
}
