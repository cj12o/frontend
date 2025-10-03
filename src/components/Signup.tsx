import { useState} from 'react'
import Button from "./Button.js"
import {useNavigate} from "react-router-dom"
import {signup as signupBackend } from "../backend/auth.ts"
import { useDispatch } from 'react-redux'

 
function Signup() {
  const [email,setEmail]=useState("")
  const [name,setName]=useState("")
  const [password,setPassword]=useState("")

  const [error,setError]=useState("")
  
  // TODO  SIGNUP TO HOME
  const navigate=useNavigate()
  // const authStatus=useSelector((state)=>state.authStatus)
  const submitHandler=async()=>{
    setError("")
    // dispatch=useDispatch()
    try{
      // const resp=await signupBackend(name,email,password)
      await signupBackend(name,email,password) 
      alert("signed up succesfully")
      navigate("/")
    }
    catch(e:any){
      console.log("Error component",e)
      setError(e.message)
    }
  }


  return (
    <div className='h-screen flex flex-col items-center justify-center pt-0'>
      {error && <h1 className='bg-red-200 text p-3 rounded-xl mb-4'>{error}</h1>}
      <div className='bg-gray-500 w-1/4 h-2/3 flex flex-col items-center justify-center rounded-2xl'>
        <form action="" className='h-4/5 w-4/5'onSubmit={(e)=>{
          e.preventDefault()
          submitHandler()
        }}>
            <div className='flex flex-col'>
                <label htmlFor="">Name:</label>
                <input type="text" placeholder="Enter your name" className='bg-white p-1 rounded w-full mx-auto my-3.5'
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required/>
                <label htmlFor="">Email:</label>
                <input type="email" placeholder='Enter email id' className='bg-white p-1 rounded w-full mx-auto my-3.5'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required/>
                <label htmlFor="">Password:</label>
                <input type="password" placeholder='Enter password' className='bg-white p-1 rounded w-full mx-auto my-3.5'
                 value={password}
                 onChange={(e)=>setPassword(e.target.value)}
                 required/>
                <Button className='m-2' type='submit' value="Sign Up"></Button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Signup