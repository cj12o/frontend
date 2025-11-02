import React, { useContext, useEffect, useState} from 'react'
import useWebSocket from 'react-use-websocket'
import { ChatbotContext } from '@/pages/Chatbot'

import { useParams } from 'react-router-dom';

function Chatbot_reply(){
    const {sendMessage,lastMessage}=useWebSocket("http://127.0.0.1:8000/ws/chatbot/")

    const {setLlmResp,setQuery}=useContext(ChatbotContext)
    const [question,setQuestion]=useState("")

    const sendQuery=(e:React.FormEvent)=>{
        try{
            e.preventDefault()
            sendMessage(question)
            setQuestion("")
        }catch(e){
            console.log(`Error in chatbot:${e}`)
        }
       
    }
    useEffect(()=>{
        if(lastMessage?.data){
            if(JSON.parse(lastMessage.data)?.status==="done"){
                return
            }
            const id=JSON.parse(lastMessage.data)["id"]
            
            if(lastMessage?.data!="done" && JSON.parse(lastMessage.data)?.["isQuestion"]==true){
                setQuery((prev:any)=>({...prev,[id]:JSON.parse(lastMessage.data)["token"]}))
            }
            else if(lastMessage?.data!="done"){
                // console.log(`ID:${id} and msg:${JSON.parse(lastMessage.data)["token"]}`)
                setLlmResp((prev:any)=>({...prev,[id]:(prev[id]||"")+JSON.parse(lastMessage.data)["token"]}))
                // setLlmResp((prev:any)=>({...prev,[id]:prev[id]+lastMessage.data}))
            }
            
        }
    },[lastMessage])
  return (
    <div>
        <form action=""  onSubmit={(e)=>{
                sendQuery(e)
            }}>
            <input type="text" className='border-black border-1'
            value={question}  onChange={(e)=>{
                e.preventDefault()
                setQuestion(e.target.value)
            }}/>
            <button type="submit" className='bg-blue-500'>Send</button>
        </form>
    </div>

  )
}

export default Chatbot_reply