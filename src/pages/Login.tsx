import { API_BASE_URL } from '@/conf'
import useAccessToken from '@/hooks/useAccessToken'
import { generateLoginCode } from '@/utils'
import { triggerAuthUpdate } from '@/utils/auth'
import { Image } from '@/utils/images'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom'

const loginCode = generateLoginCode()

export default function Login() {
  const accessToken = useAccessToken()

  const [loginEmail, setLoginEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [loginCodeInput, setLoginCodeInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userData, setUserData] = useState({})

  // triggerAuthUpdate
  const redirect = useNavigate()

  const handleEmailValidation = async () => {
    // if (loginCodeInput) return
    if (!loginEmail) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    // Check if the email is valid
    if (!emailRegex.test(loginEmail)) {
      toast.error('Invalid email address')
      return false
    }

    // Check if the email is in the database
    try {
      setIsLoading(true)
      const response = await fetch(
        `${API_BASE_URL}/crm/v7/Contacts/search?email=${loginEmail}`,
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
        setUserData(data)
        setIsLoading(false)
        setIsEmailValid(true)
        handleCode(data)
        toast.success('Check your email for login code')
      } else {
        setIsEmailValid(false)
        setIsLoading(false)
        toast.error('Email not found')
      }
    } catch (error) {
      setIsLoading(false)
      toast.error('Email not found')
    }
  }

  const handleCode = async (data: any) => {
    console.log(data)
    // Send put request - with login code and email
    const constructedData = {
      data: [
        {
          Login_code: loginCode,
          email: loginEmail,
        },
      ],
    }
    try {
      // setIsLoading(true)
      const res = await fetch(
        `${API_BASE_URL}/crm/v7/Contacts/${data.data[0].id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(constructedData),
        }
      )
      const _data = await res.json()
      if (_data.data[0].status !== 'success') {
        toast.error('Something went wrong')
        throw new Error('Response is not SUCCESS')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAfterCodeSent = () => {
    if (loginCodeInput === loginCode) {
      setIsLoading(false)
      toast.success('Successfully logged in')
      localStorage.setItem('isLoggedin', 'true')
      // @ts-ignore
      localStorage.setItem('user', JSON.stringify(userData?.data[0]))
      triggerAuthUpdate() // Dispatch event before navigation

      // setTimeout(() => {
      redirect('/')
      // }, 100) // Small delay to ensure event dispatch
    }
  }

  return (
    <>
      <div className='text-gray-900 flex justify-center'>
        <div className='max-w-screen-xl m-0 sm:rounded-lg flex justify-center flex-1'>
          <div className='lg:w-1/2 xl:w-5/12 sm:p-0'>
            <div className='mt-12 flex flex-col items-center'>
              <h1 className='text-2xl xl:text-3xl font-extrabold'>Login</h1>
              <div className='w-full flex-1 mt-8'>
                <form
                  onSubmit={handleEmailValidation}
                  className='mx-auto w-full max-w-md'
                >
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
                    onClick={
                      loginCodeInput
                        ? handleAfterCodeSent
                        : handleEmailValidation
                    }
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className='mx-auto flex'>
                        <TailSpin
                          visible={true}
                          height='25'
                          color='#fff'
                          ariaLabel='tail-spin-loading'
                          radius='1'
                          wrapperStyle={{
                            margin: 'auto',
                            textAlign: 'center',
                          }}
                          wrapperClass=''
                        />
                      </div>
                    ) : (
                      <span className='ml-3'>Login</span>
                    )}
                  </button>
                  <p className='text-center text-sm mt-3'>
                    Don't have an account?{' '}
                    <Link to='/signup' className='text-red-400 font-bold'>
                      Sign Up
                    </Link>
                  </p>
                </form>
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
