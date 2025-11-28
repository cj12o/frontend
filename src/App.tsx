
import './App.css'
import { Outlet } from 'react-router-dom'


import {Header} from './components/index.js'



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
