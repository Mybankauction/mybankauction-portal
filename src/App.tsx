import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Maintenance from './components/Maintenance'
import IndexLanding from './landing_page/IndexLanding'
import ItemDetails from './pages/ItemDetails'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import { getAuthToken } from './utils/api'
import Account from './pages/Account'

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = getAuthToken()
  if (!token) {
    return <Navigate to='/' replace />
  }
  return children
}

function RedirectIfAuth({ children }: { children: JSX.Element }) {
  const token = getAuthToken()
  if (token) {
    return <Navigate to='/properties' replace />
  }
  return children
}

export default function App() {
  // useAccessToken()
  // useEffect(() => {
  //   const isCleared = localStorage.getItem('isAlreadyCleared')

  //   if (!isCleared) {
  //     // Clear the relevant localStorage items
  //     localStorage.clear()

  //     // Set the flag to prevent future clears
  //     localStorage.setItem('isAlreadyCleared', 'true')
  //   }
  // }, [])

  return (
    <div className=''>
      <div className=''>
        <BrowserRouter>
        <Routes>
            <Route element={<RequireAuth><ItemDetails /></RequireAuth>} path='/properties/:id' />
            <Route element={<RequireAuth><Home /></RequireAuth>} path='/properties' />
            <Route element={<RedirectIfAuth><IndexLanding /></RedirectIfAuth>} path='/' />
            <Route element={<RequireAuth><Account /></RequireAuth>} path='/account' />
            <Route element={<NotFound />} path='*' />
        </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}
