import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Maintenance from './components/Maintenance'
import ProtectedRoute from './components/ProtectedRoute'
import Account from './pages/Account'
import Home from './pages/Home'
import ItemDetails from './pages/ItemDetails'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Signup from './pages/Signup'

export default function App() {
  useEffect(() => {
    const isCleared = localStorage.getItem('isAlreadyCleared')

    if (!isCleared) {
      // Clear the relevant localStorage items
      localStorage.clear()

      // Set the flag to prevent future clears
      localStorage.setItem('isAlreadyCleared', 'true')
    }
  }, [])

  return (
    <div className=''>
      <div className='container px-3 '>
        <BrowserRouter>
          <Header />
          <Routes>
            {/* <Route element={<Maintenance />} path='*' /> */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Home />} path='/' />
              <Route element={<ItemDetails />} path='/properties/:id' />
              <Route element={<Account />} path='/account' />
            </Route>
            <Route element={<Login />} path='/login' />
            <Route element={<Signup />} path='/signup' />
            <Route element={<NotFound />} path='*' />
          </Routes>
          {/* <hr className='my-16 border-gray-200 max-w-[80rem] mx-auto' /> */}
          {/* <Footer /> */}
        </BrowserRouter>
      </div>
    </div>
  )
}
