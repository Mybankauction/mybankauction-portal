import { UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../constants'
import { Image } from '../utils/images'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from './ui/drawer'

function NavLinks() {
  return (
    <ul className='hidden md:flex items-center gap-3'>
      {NAV_LINKS.map((item) => (
        <Link to={item.url} key={item.name}>
          <li className='px-4 cursor-pointer font-outfit text-center'>
            {item.name}
          </li>
        </Link>
      ))}
    </ul>
  )
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedin') === 'true'
  )

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedin') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  // Added in useEffect to handle auth state updates
  useEffect(() => {
    const handleStorageChange = () => {
      const loggedIn = localStorage.getItem('isLoggedin') === 'true'
      setIsLoggedIn(loggedIn)
    }

    // Listen for storage or custom auth events
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authEvent', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authEvent', handleStorageChange)
    }
  }, [])

  return (
    <header className='flex justify-between items-center  mb-5 rounded-md  py-3 px-5'>
      <Link to='/'>
        <div className='cursor-pointer flex items-center gap-3'>
          <img src={Image.Logo} alt='Logo' width={50} className='min-w-10' />
          <span className='text-primary font-bold hidden lg:block text-lg'>
            Mybankauction
          </span>
        </div>
      </Link>
      <div className='flex items-center gap-3'>
        <div className=''>
          <NavLinks />
          <div className='block md:hidden'>
            <div className='block md:hidden'>
              <Drawer>
                <DrawerTrigger>
                  <img
                    src={Image.BurgerMenu}
                    alt='BurgerMenu'
                    className='cursor-pointer'
                    width={28}
                  />
                </DrawerTrigger>
                <DrawerContent>
                  <ul className='flex flex-col gap-3 p-4'>
                    {NAV_LINKS.map((item) => (
                      <a href={item.url} key={item.name}>
                        <li className='px-4 cursor-pointer font-outfit'>
                          {item.name}
                        </li>
                      </a>
                    ))}
                  </ul>
                  <DrawerFooter>
                    <DrawerClose>
                      <button className='text-xs text-white bg-primary px-4 py-2 rounded font-bold'>
                        Close
                      </button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>

        {isLoggedIn ? (
          <Link to='/account'>
            <div className='border rounded-full p-2 bg-gray-200'>
              {/* Replace with the actual profile icon component */}
              <UserRound />
            </div>
          </Link>
        ) : (
          <Link to='/login'>
            <div className='flex items-center gap-2 bg-primary max-w-fit px-4 py-2 cursor-pointer'>
              <button className='text-sm text-white font-bold font-outfit'>
                LOGIN
              </button>
              <span>
                <img src={Image.ArrowIcon} alt='ArrowIcon' />
              </span>
            </div>
          </Link>
        )}
      </div>
    </header>
  )
}
