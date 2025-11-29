import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useNavigation } from 'react-router-dom'
import { getRoomsList } from '@/backend/moderator'
import { useSelector } from 'react-redux'
const Moderator = () => {
    type Rooms={
        id:number,
        name:string
    }
    const [rooms,setRooms]=useState<Rooms[]>([]) 
    const [error,setError]=useState("")
    const authstatus=useSelector((state:any)=>state.authStatus)
    const navigate=useNavigate()

    useEffect(()=>{
        getRoomsList()
        .then((data)=>setRooms(()=>[...data]))
        .catch((e)=>setError(e.message))
    },[])
  return (
    <>
    {
        authstatus?(
            <>
           <div>Moderator</div>
           <div>
            {
                error.length>0 && <div className='bg-red-300'>{error}</div>
            }
        
           </div>
            <div>
                {
                    rooms && error.length===0 && rooms.map((room)=>
                        <div key={room.id}>
                            {room.name}
                            <button
                            onClick={()=>navigate(`/moderator/rooms/${room.id}`)}
                            >
                                Moderate
                            </button>
                        </div>
                    )   
                }
            </div>
            </>
        ):navigate("/login")
    }
    </> 
  )
}

export default Moderator