import useAccessToken from '@/hooks/useAccessToken'
import { generateLoginCode } from '@/utils'
import { triggerAuthUpdate } from '@/utils/auth'
import { Image } from '@/utils/images'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

const loginCode = generateLoginCode()
export default function Login() {
  const accessToken = useAccessToken()

  const [loginEmail, setLoginEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [loginCodeInput, setLoginCodeInput] = useState('')
  // triggerAuthUpdate
  const redirect = useNavigate()
  const handleEmailValidation = async () => {
    if (!loginEmail) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // Check if the email is valid
    if (!emailRegex.test(loginEmail)) {
      toast.error('Invalid email address')
      return false
    }

    // Check if the email is in the database
    try {
      const response = await fetch(
        `/zoho/crm/v7/Contacts/search?email=${loginEmail}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      if (data.data.length > 0) {
        setIsEmailValid(true)
        toast.success('Check your email for login code')
        // Send put request - with login code and email
        const constructedData = {
          data: [
            {
              Login_code: loginCode,
              email: loginEmail,
            },
          ],
        }
        const res = await fetch(`/zoho/crm/v7/Contacts/${data.data[0].id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(constructedData),
        })
        const _data = await res.json()
        console.log(_data)
        // After sending put request with login code and user id
        if (_data.data[0].status === 'success') {
          if (loginCodeInput === loginCode) {
            toast.success('Successfully logged in')
            localStorage.setItem('isLoggedin', 'true')
            localStorage.setItem('user', JSON.stringify(data.data[0]))
            triggerAuthUpdate() // Dispatch event before navigation

            setTimeout(() => {
              redirect('/')
            }, 100) // Small delay to ensure event dispatch
          }
        } else {
          setIsEmailValid(false)
          toast.error('Something went wrong')
        }
      } else {
        setIsEmailValid(false)
        toast.error('Email not found')
      }
    } catch (error) {
      toast.error('Email not found')
    }
  }

  return (
    <>
      <div className=' text-gray-900 flex justify-center'>
        <div className='max-w-screen-xl m-0 bg-white sm:rounded-lg flex justify-center flex-1'>
          <div className='lg:w-1/2 xl:w-5/12 sm:p-0'>
            <div className='mt-12 flex flex-col items-center'>
              <h1 className='text-2xl xl:text-3xl font-extrabold'>Login</h1>
              <div className='w-full flex-1 mt-8'>
                <div className='mx-auto w-full max-w-md'>
                  <div className=''>
                    <label htmlFor='email' className='text-sm mb-1 block'>
                      Email
                    </label>
                    <input
                      className='w-full px-4 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none'
                      type='email'
                      id='email'
                      placeholder='Email'
                      value={loginEmail}
                      onChange={(evt) => setLoginEmail(evt.target.value)}
                      required
                    />
                  </div>
                  {isEmailValid ? (
                    <div className='mt-5'>
                      <label htmlFor='password' className='text-sm mb-1 block'>
                        Code
                      </label>
                      <input
                        className='w-full px-4 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none'
                        type='number'
                        id='code'
                        placeholder='Code'
                        value={loginCodeInput}
                        onChange={(evt) => setLoginCodeInput(evt.target.value)}
                        required
                      />
                    </div>
                  ) : null}
                  {/* <div className='mt-5'>
                    <label htmlFor='password' className='text-sm mb-1 block'>
                      Password *
                    </label>
                    <input
                      className='w-full px-4 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none'
                      type='password'
                      id='password'
                      placeholder='Password'
                      // value={user.password}
                      // onChange={handleInputChange}
                      required
                    />
                  </div> */}

                  <button
                    className='mt-6 tracking-wide font-semibold bg-red-400 text-gray-100 w-full py-3 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'
                    type='submit'
                    onClick={handleEmailValidation}
                  >
                    <span className='ml-3'>Login</span>
                  </button>
                  <p className='text-center text-sm mt-3'>
                    Don't have an account?{' '}
                    <Link to='/signup' className='text-red-400 font-bold'>
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
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
    </>
  )
}
