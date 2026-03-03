import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Routes,Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import Registration from './pages/Registration'
import Login from './pages/Login'

import Home from './pages/Home'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/registration' element={<Registration/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
