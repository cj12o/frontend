import { useEffect, useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'

import {Header} from './components/index.js'

import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

import { login,logout } from './store/authSlice.js'


function App() {

  return (
    <div className='w-full h-full'>
      <Header/>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
