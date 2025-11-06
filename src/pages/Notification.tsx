import React, { useEffect,useState } from 'react'
import useWebSocket from 'react-use-websocket'


const Notification = () => {
    type Notification={
        id:number,
        notify:string
    }
    const {sendMessage,lastJsonMessage}=useWebSocket(`ws://127.0.0.1:8000/ws/notify/?token=${localStorage.getItem("cookie")||""}`)
    
    const [notifications,SetNotifications]=useState<Notification []>([])

    useEffect(()=>{
        if(!lastJsonMessage) return 
        
        SetNotifications((prev)=>{
            // const exists=prev.some((n) => n.id === lastJsonMessage.id)
            // if(exists) return prev
            return [...prev,{id:lastJsonMessage?.id,notify:lastJsonMessage?.notify}]
        })
        
    },[lastJsonMessage])
    return (
        <>
        <div>Notification</div>
        <div>
            {
                notifications.length>0?notifications.map((notf:Notification)=>{
                    return <div key={notf.id} className='bg-gray-400 text-center'>{notf.notify}</div>
                }):null
            }
        </div>
        </>
    )
}

export default Notification