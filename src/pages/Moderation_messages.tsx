import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useNavigation, useParams } from 'react-router-dom'
import { getRoomsList } from '@/backend/moderator'
import { useSelector } from 'react-redux'
import { getMessageList,sendMessageList} from '@/backend/moderator'
import { roomlist } from '@/backend/room_list'

const Moderation_messages = () => {
    type Messages={
        id:number,
        message:string,
        images_msg: null|File,
        file_msg: null|File,
    }

    const [messages,setMessages]=useState<Messages[]>([]) 
    const [id_action_needed,set_id_action_needed]=useState<number []>([])
    const [id_no_action_needed,set_id_no_action_needed]=useState<number []>([])
    const [error,setError]=useState("")
    const[popUp,setPopUp]=useState(false)
    const authstatus=useSelector((state:any)=>state.authStatus)
    const navigate=useNavigate()
    
    const {id}=useParams()

    useEffect(()=>{
        getMessageList(Number(id))
        .then((data)=>setMessages(()=>[...data]))
        .catch((e)=>setError(e.message))
    },[])

    const submitHandler=async()=>{
        try{
            const resp=await sendMessageList(Number(id),id_no_action_needed,id_action_needed)
            if(resp==200){
                setPopUp(true)
            }
            else setError("Error in moderating messages")
        }
        catch(e:any){
            setError(e.message)
        }
    }
  return (
    <>
    {
        authstatus?(
            <>
           <div>Messages</div>
           <div>
            {
                popUp?(
                    <div>
                    <p>"Messages Moderated successfully"</p>
                    <button
                    onClick={()=>navigate("/moderator")}>
                        go back
                    </button>
                    <button
                    onClick={()=>navigate('/')}>
                        home
                    </button>
                    </div>):null
            }
           </div>
           <div>
            {
                error.length>0 && <div className='bg-red-300'>{error}</div>
            }
        
           </div>
            <div>
                {
                    messages && error.length===0 && messages.map((msg)=>
                        <div key={msg.id}>
                            {msg.message}
                            <button
                            className='bg-red-500'
                            onClick={()=>{
                                set_id_action_needed((prev)=>[...prev,msg.id])
                            }}>
                                Mark unsafe
                            </button>
                            <button
                            className='bg-green-300'
                            onClick={()=>{
                                set_id_no_action_needed((prev)=>[...prev,msg.id])
                            }}>
                                No Action needed
                            </button>
                        </div>
                    )   
                }
            </div>
            <div>
                <button
                onClick={submitHandler}>
                    Submit
                </button>
            </div>
            </>
        ):navigate("/login")
    }
    </> 
  )
}

export default Moderation_messages