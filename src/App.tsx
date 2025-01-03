import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Account from './pages/Account'
import Home from './pages/Home'
import ItemDetails from './pages/ItemDetails'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Signup from './pages/Signup'

export default function App() {
  return (
    <div className='bg-bgPrimary'>
      <div className='container px-3 '>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<Home />} path='/' />
              <Route element={<ItemDetails />} path='/properties/:id' />
              <Route element={<Account />} path='/account' />
            </Route>
            <Route element={<Login />} path='/login' />
            <Route element={<Signup />} path='/signup' />
            <Route element={<NotFound />} path='*' />
          </Routes>
          <hr className='my-16 border-gray-400 max-w-[80rem] mx-auto' />
          <Footer />
        </BrowserRouter>
      </div>
    </div>
  )
}
