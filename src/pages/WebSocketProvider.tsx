import React, { useMemo } from 'react'
import { createContext,useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Provider } from 'react-redux'
import useWebSocket from 'react-use-websocket'
import Room from './Room.tsx'


const WebSocketContext=createContext<any>(null)

const WebSocketContextProvider=({id,children}:{id:string,children:React.ReactNode})=>{
  
  const url=useMemo(()=>{return `http://127.0.0.1:8000/ws/chat/${id}/?token=${localStorage.getItem("cookie")||""}`},[id])

  const {sendMessage,lastJsonMessage}=useWebSocket(url
  ,{
      shouldReconnect:()=>true,
  })

  const value=useMemo(()=>{
    return {sendMessage,lastJsonMessage}
  },[sendMessage,lastJsonMessage])
  
  
  return (
      <WebSocketContext.Provider value={value} >
        {children}
      </WebSocketContext.Provider>
  )
}


export default WebSocketContextProvider
export {WebSocketContext}