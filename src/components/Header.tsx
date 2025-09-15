import useAuth from '@/hooks/useAuth'
import { UserRound } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINKS } from '../constants'
import { Image } from '../utils/images'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from './ui/drawer'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import LoginForm from './auth/LoginForm'
import SignupForm from './auth/SignupForm'

function useActiveSection() {
  const [active, setActive] = React.useState<string | null>(null)

  React.useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.id).filter(Boolean) as string[]
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { rootMargin: '-60% 0px -35% 0px', threshold: [0, 1] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return active
}

function NavLinks() {
  const active = useActiveSection()

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id?: string
  ) => {
    if (id) {
      e.preventDefault()
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <ul className='hidden tablet:flex items-center gap-5 lg:gap-8'>
      {NAV_LINKS.map((item) => {
        const isActive = active === item.id
        return (
          <Link
            to={item.url ?? (item.id ? `/#${item.id}` : '/')}
            key={item.name}
            onClick={(e) => handleClick(e, item.id)}
          >
            <li
              className={`px-0 md:px-0 cursor-pointer font-outfit text-center font-semibold text-2xl transition-colors py-2 md:py-0 w-full md:w-auto ${
                isActive ? 'text-[#E34732]' : 'text-neutral-800 hover:text-[#E34732]'
              }`}
            >
              {item.name}
            </li>
          </Link>
        )
      })}
    </ul>
  )
}

export default function Header() {
  const isLoggedIn = useAuth()
  const location = useLocation()
  const showLandingNav = location.pathname === '/'
  const logoHref = showLandingNav ? '/' : '/properties'
  const [authOpen, setAuthOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'login' | 'signup'>('login')

  return (
    <header className='sticky top-0 z-50 bg-slate-200 text-white py-2 shadow-md transition-all'>
      <div className='container mx-auto px-4 flex flex-col min-[1250px]:flex-row justify-between items-center'>
        <div className='flex items-center justify-between w-full min-[1250px]:w-auto'>
          <Link to={logoHref}>
            <div className='cursor-pointer flex items-center gap-3'>
              <img src={Image.Logo} alt='Logo' className='h-17 w-auto object-contain rounded-sm' />
            </div>
          </Link>
          <div className='hidden max-[1250px]:block p-2'>
            {isLoggedIn ? (
              <Link to='/account'>
                <div className='border border-red-500 rounded-full p-2 bg-white/10 text-white hover:bg-auction-gold hover:text-auction-navy'>
                  <UserRound color='#E34732'/>
                </div>
              </Link>
            ) : (
              <Drawer>
                <DrawerTrigger aria-label='Open menu'>
                  <img
                    src={Image.BurgerMenu}
                    alt='BurgerMenu'
                    className='cursor-pointer'
                    width={28}
                  />
                </DrawerTrigger>
                <DrawerContent>
                  <ul className='flex flex-col gap-3 p-4'>
                    {showLandingNav && (
                      NAV_LINKS.map((item) => (
                        <a
                          href={item.id ? `#${item.id}` : item.url}
                          key={item.name}
                          onClick={(e) => {
                            if (item.id) {
                              e.preventDefault()
                              const el = document.getElementById(item.id)
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }
                          }}
                        >
                          <li className='px-4 cursor-pointer font-outfit hover:text-[#E34732] transition-colors'>
                            {item.name}
                          </li>
                        </a>
                      ))
                    )}
                  </ul>
                  <div className='p-4'>
                    <button
                      onClick={() => { setActiveTab('login'); setAuthOpen(true) }}
                      className='w-full text-center bg-[#E34732] text-white rounded px-4 py-2 font-semibold'
                    >
                      Login / Sign Up
                    </button>
                  </div>
                  <DrawerFooter>
                    <DrawerClose>
                      <button className='text-xs text-white bg-primary px-4 py-2 rounded font-bold'>
                        Close
                      </button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
          </div>
        </div>

        <div className='hidden min-[1250px]:flex flex-1 justify-center'>
          {showLandingNav && <NavLinks />}
        </div>

        <div className='hidden min-[1250px]:block'>
          <div className='hidden min-[1250px]:flex items-center gap-6 mt-4 min-[1250px]:mt-0 w-full min-[1250px]:w-auto justify-end'>
            {isLoggedIn ? (
              <Link to='/account'>
                <div className='border border-red-500 rounded-full p-2 bg-white/10 text-white hover:bg-auction-gold hover:text-auction-navy'>
                  <UserRound color='#E34732'/>
                </div>
              </Link>
            ) : (
              <button
                onClick={() => { setActiveTab('login'); setAuthOpen(true) }}
              >
                <div className='inline-flex items-center justify-center gap-2 border h-10 px-4 py-2 w-full tablet:w-auto bg-[#E34732] text-white hover:bg-auction-gold hover:text-auction-navy border-white cursor-pointer'>
                  <span className='text-sm font-bold font-outfit'>
                    LOGIN
                  </span>
                  <span>
                    <img src={Image.ArrowIcon} alt='ArrowIcon' />
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className='max-w-lg w-full'>
          <DialogHeader>
            <DialogTitle className='text-lg font-bold'>
              {activeTab === 'login' ? 'Login' : 'Sign Up'}
            </DialogTitle>
          </DialogHeader>
          <div className='flex gap-2 mb-4'>
            <button
              onClick={() => setActiveTab('login')}
              className={`px-4 py-2 rounded border ${activeTab === 'login' ? 'bg-[#E34732] text-white border-[#E34732]' : 'bg-white text-neutral-800'}`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`px-4 py-2 rounded border ${activeTab === 'signup' ? 'bg-[#E34732] text-white border-[#E34732]' : 'bg-white text-neutral-800'}`}
            >
              Sign Up
            </button>
          </div>
          <div>
            {activeTab === 'login' ? (
              <LoginForm onSuccess={() => setAuthOpen(false)} />
            ) : (
              <SignupForm onSuccess={() => setAuthOpen(false)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
