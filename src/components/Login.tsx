import { useState } from 'react'
import Button from "./Button.js"
import {useNavigate} from "react-router-dom"
import { useDispatch} from 'react-redux';
import { login as loginBackend } from '../backend/auth.ts';

 
function Login() {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")

  const [error,setError]=useState("")

  const dispatch=useDispatch()
  const navigate=useNavigate()

  // const authStatus=useSelector((state)=>state.authStatus)
  const submitHandler=async()=>{
    setError("")
    try{
      // const resp=await loginBackend(email,password,dispatch)
      await loginBackend(email,password,dispatch)
      navigate("/")
    }
    catch(e:any){
      console.log(`Error=>${e.message}`)
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
                <Button className='m-2' type='submit'>Login</Button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Login