import React, { useMemo } from 'react'
import { createContext,useContext } from 'react'
import useWebSocket from 'react-use-websocket'



const WebSocketContext=createContext<any>(null)

const WebSocketContextProvider=({id,children}:{id:string,children:React.ReactNode})=>{
  
  const url=useMemo(()=>{return `ws://127.0.0.1:8000/ws/chat/${id}/?token=${localStorage.getItem("cookie")||""}`},[id])

  const {sendMessage,lastJsonMessage}=useWebSocket(url
  ,{
      shouldReconnect:()=>false,
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