import useAccessToken from '@/hooks/useAccessToken'
import { generateReferralCode } from '@/utils'
import { registerUser, verifyRefCode } from '@/utils/api'
import { triggerAuthUpdate } from '@/utils/auth'
import { Image } from '@/utils/images'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const code = generateReferralCode()

  const [user, setUser] = useState({
    Name1: '',
    Phone: '',
    Email: '',
    // password: '',
    referral_id: code,
    refCode: '',
    referred_by: '',
  })
  let referrerData: any
  const redirect = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const accessToken = useAccessToken()
  const handleInputChange = (e: any) => {
    const { id, value } = e.target
    setUser((prevUser) => ({ ...prevUser, [id]: value }))

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Verify referral code if it exists
      if (user.refCode) {
        referrerData = await handleRefCodeVerification(
          user.refCode,
          accessToken
        )
        if (!referrerData) {
          setError('Invalid referral code.')
          setLoading(false)
          return
        }
      }

      // Use referrerData directly
      user.referred_by = referrerData?.data[0]?.id || ''

      // Proceed with registration
      const isRegistrationSuccessful = await handleUserRegistration(
        user,
        accessToken
      )
      if (isRegistrationSuccessful) {
        localStorage.setItem('isLoggedin', 'true')
        const createdUser = {
          ...user,
          id: isRegistrationSuccessful?.details.id,
        }
        localStorage.setItem('user', JSON.stringify(createdUser))

        triggerAuthUpdate()
        toast.success('Registration successful!')
        redirect('/')
        setError('') // Clear any previous errors
        setUser({
          Name1: '',
          Phone: '',
          Email: '',
          referral_id: '',
          refCode: '',
          referred_by: '',
        })
      } else {
        return
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUserRegistration = async (
    user: any,
    accessToken: string
  ): Promise<any> => {
    try {
      if (referrerData) {
        user.referred_by = referrerData?.data[0].id
      } else {
        user.referred_by = ''
      }

      const registerResponse = await registerUser(user, accessToken)
      if (registerResponse.data[0].status === 'success') {
        return registerResponse.data[0]
      } else {
        // Set error only if registration fails
        setError(registerResponse.message)
        return false
      }
    } catch (error) {
      console.error('Error during registration:', error)
      setError('Failed to register user.')
      return false
    }
  }

  const handleRefCodeVerification = async (
    refCode: string,
    accessToken: string
  ): Promise<any> => {
    try {
      const verifyResponse = await verifyRefCode(refCode, accessToken)
      console.log(verifyResponse)
      if (verifyResponse) {
        return verifyResponse
      }
      return null
    } catch (error) {
      console.error('Error verifying referral code:', error)
      setError('Failed to verify referral code.')
      return null
    }
  }

  return (
    <div className=' text-gray-900 flex justify-center'>
      <div className='max-w-screen-xl bg-white sm:rounded-lg flex justify-center flex-1'>
        <div className='lg:w-1/2 xl:w-5/12 sm:p-0'>
          <div className='flex flex-col items-center'>
            <h1 className='text-2xl xl:text-3xl font-extrabold'>Sign up</h1>
            <form className='w-full flex-1 ' onSubmit={handleSubmit}>
              <div className='mx-auto w-full max-w-md'>
                <div className=''>
                  <label htmlFor='name' className='text-sm mb-1 block'>
                    Name *
                  </label>
                  <input
                    className='w-full px-4 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none'
                    type='text'
                    id='Name1'
                    placeholder='Name'
                    value={user.Name1 || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className='mt-5'>
                  <label htmlFor='email' className='text-sm mb-1 block'>
                    Email *
                  </label>
                  <input
                    className='w-full px-4 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none'
                    type='email'
                    id='Email'
                    placeholder='Email'
                    value={user.Email || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='mt-5'>
                  <label htmlFor='phone' className='text-sm block mb-1'>
                    Phone number *
                  </label>
                  <input
                    className='w-full px-4 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none '
                    type='tel'
                    id='Phone'
                    placeholder='Phone number'
                    value={user.Phone || ''}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* <div className='mt-5'>
                  <label htmlFor='password' className='text-sm mb-1 block'>
                    Password *
                  </label>
                  <input
                    className='w-full px-4 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none'
                    type='password'
                    id='password'
                    placeholder='Password'
                    value={user.password}
                    onChange={handleInputChange}
                    required
                  />
                </div> */}
                <div className='mt-5'>
                  <label htmlFor='refCode' className='text-sm mb-1 block'>
                    Referral Code (optional)
                  </label>
                  <input
                    className='w-full px-4 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none'
                    type='number'
                    id='refCode'
                    placeholder='Code'
                    minLength={4}
                    maxLength={4}
                    value={user.refCode || ''}
                    onChange={handleInputChange}
                  />
                </div>

                {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

                <button
                  type='submit'
                  className='mt-5 tracking-wide font-semibold bg-red-400 text-gray-100 w-full py-3 rounded-lg  transition-all duration-300 ease-in-out flex items-center justify-center'
                  disabled={loading}
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <span className='ml-3'>Sign Up</span>
                  )}
                </button>

                <p className='text-center text-sm mt-3'>
                  Already have an account?{' '}
                  <Link to='/login' className='text-red-400 font-bold'>
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className='flex-1 text-center hidden lg:flex'>
          <div
            className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${Image.HouseRealEstate})` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
