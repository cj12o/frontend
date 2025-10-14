import React from 'react'
import { Button } from "../components/index"
// {   
//     "name":"zey",
//     "description": "dicuss regarding ipl",
//     "topic":"ipl",
//     "is_private":false
//      "moderator":["messi","main"]
// }
const Form = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center pt-0'>
      {/* {error && <h1 className='bg-red-200 text p-3 rounded-xl mb-4'>{error}</h1>} */}
      <div className='bg-gray-500 w-1/4 h-4/5 flex flex-col items-center justify-center rounded-2xl'>
        <form action="" className='h-4/5 w-4/5'onSubmit={(e)=>{
          e.preventDefault()
          // submitHandler()
        }}>
            <div className='flex flex-col'>
                <label htmlFor="">Name:</label>
                <input type="text" placeholder='Enter Room Name...' className='bg-white p-1 rounded w-full mx-auto my-3.5'
                // value={email}
                // onChange={(e)=>setEmail(e.target.value)}
                required/>
                <label htmlFor="">Description:</label>
                <textarea name="" id="" placeholder='Enter description'  className='bg-white p-1 rounded w-full mx-auto my-3.5'></textarea>
                <label htmlFor="">Add topics(tages):</label>
                <input type="text" placeholder='Ad tags like: football,messi' className='bg-white p-1 rounded w-full mx-auto my-3.5' required/>
                <div className='flex'>
                  <label htmlFor="" className='m-3'>Private:</label>
                  <input type="checkbox" name="" id="" />
                </div>
                {/* {search mod} */}
                <form >
                  <input type="text" name="" id="" placeholder='Seatch mods..'/>
                  <ul className='bg-white'>
                    <li onClick={()=>{console.log("hi")}} >hi</li>
                    <li>hfeufhf</li>
                  </ul>
                  <button type="submit" className='bg-red-500'>Search</button>
                </form>
                
            
            </div>
        </form>
      </div>
    </div>
  )
}


export default Form