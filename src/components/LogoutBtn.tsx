import React ,{useState} from 'react'
import {Button} from './index.js'
import { useDispatch } from 'react-redux'
import { logout  as reducerLogout} from '../store/authSlice.js'
import { useNavigate } from 'react-router-dom'
import { logout as logoutBackend } from '../backend/auth.js'

function LogoutBtn() {
    const dispatch=useDispatch()
    const navigate=useNavigate()

    const [error,setError]=useState("")

    const logoutHandler=async ()=>{
      try{
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