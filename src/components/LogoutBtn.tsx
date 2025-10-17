import React ,{useState,useRef} from 'react'
import {Button} from './index.js'
import { useDispatch, useSelector } from 'react-redux'
import { logout  as reducerLogout} from '../store/authSlice.js'
import { useNavigate } from 'react-router-dom'
import { logout as logoutBackend } from '../backend/auth.js'
import { sendHist } from '@/backend/hist.js'
import { SaveRecommendation } from '@/backend/recommendation.js'


function LogoutBtn() {
    const dispatch=useDispatch()
    const navigate=useNavigate()


    const visitedRooms = useSelector((state:any) => state.visitedRoomId);
  

    // store latest state in a ref
    const visitedRoomsRef = useRef(visitedRooms);
    visitedRoomsRef.current = visitedRooms;

    const [error,setError]=useState("")

    const logoutHandler=async ()=>{
      try{
        
        await sendHist(visitedRoomsRef.current)
        await SaveRecommendation()

        const resp=await logoutBackend(dispatch)
        console.log("Suggesfully logged out")
        navigate("/login")
        
      }catch(e:any){
        setError(e.message)
      }
    }
  return (
    <Button onClick={logoutHandler} value="Logout"></Button>
  )
}

export default LogoutBtn