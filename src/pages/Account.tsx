import Header from '@/components/Header'
import { triggerAuthUpdate } from '@/utils/auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Account() {
  const [UserData, setUserData] = useState<any>(null)
  const navigate = useNavigate()

  console.log(UserData);
  
  const handleLogout = () => {
    triggerAuthUpdate();
    navigate('/'); 
    setUserData(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('apiStore');
    localStorage.removeItem("interestedAuctionIds")
    window.location.reload();
  };
  

  useEffect(() => {
    try {
      const _user = JSON.parse(localStorage.getItem("user") || 'null')
      if (_user) {
        setUserData(_user)
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Failed to parse user data:', error)
      navigate('/properties')
    }
  }, [navigate])

  return (
    <>
    <Header/>
    <section className='grid place-content-center flex-col'>
      <h1 className='text-4xl font-bold mt-10'>Account</h1>
      <div className='my-10'>
        <p>Name</p>
        <p className='text-2xl'>{UserData?.Name1 || 'NA'}</p>
      </div>

      <div className='mb-10'>
        <p>Phone Number</p>
        <p className='text-2xl'>{UserData?.phone_number || 'NA'}</p>
      </div>

      <div>
        <p>Email</p>
        <p className='text-2xl'>{UserData?.email || 'NA'}</p>
      </div>
      
      <div>
        <button
          className='bg-red-600 mt-10 py-2 px-4 rounded-sm text-white'
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </section>
    </>
  )
}