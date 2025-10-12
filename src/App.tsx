import { useEffect,useRef } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import {Header} from './components/index.js'

import { sendHist } from './backend/hist.js'


function App() {

  const visitedRooms = useSelector((state:any) => state.visitedRoomId);


  // store latest state in a ref
  const visitedRoomsRef = useRef(visitedRooms);


  visitedRoomsRef.current = visitedRooms; // always keep it updated
  
  useEffect(()=>{
    //send data to backend

    window.addEventListener("beforeunload",(e)=>{
      e.preventDefault()
      sendHist(visitedRoomsRef.current)
      // dispatch(logout())
    })
  },[])
  

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
