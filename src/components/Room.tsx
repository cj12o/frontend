import React, { useEffect, useState } from 'react'
import {getMessages as getMessagesBackend} from '../backend/room.ts'
import { useParams } from 'react-router-dom'
import { Type } from 'lucide-react'
import { Link } from 'react-router-dom'
import {Button} from "./index.ts"
import {Card,CardAction,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover"
import { postMsg } from '@/backend/message.ts'

const Room = () => {
  type MsgType={
    id:number,
    author:string,
    room:string,
    message:string,
    created_at:Date,
    updated_at:Date,
    reactions: []
  }


  const {id}=useParams()
  const [msgs,setMsgs]=useState <MsgType[]>([])
  // to post
  const [message,setMessage]=useState<string>("")

  const getMessages=async()=>{
    try{
      const resp=await getMessagesBackend(Number(id))
      setMsgs(resp?.msg_lst)
    }catch(e){
      console.log("Error in roommasg fetching:",e)
    }
  }

  useEffect(()=>{
    getMessages()
  },[])
// post msg
  const submitHandler=async(e:any)=>{
    e.preventDefault()
    try{
      const resp=await postMsg(Number(id),message)
    }catch(error){

    } 
  }
  return(
    <>
    {
      msgs.map((msg)=>{ 
      return <Card className="w-full">
        <CardHeader>
          <CardTitle>@{msg.author}</CardTitle>
          <CardDescription>{`posted: ${String(msg.updated_at)} ago`}</CardDescription>
          <CardAction className=''>
            <Popover>
              <PopoverTrigger className='p-1 '>➕</PopoverTrigger>
              <PopoverContent>
                <form className="h-full w-full flex-col" action="" 
                onSubmit={(e)=>submitHandler(e)}>
                  <div className='w-full '>
                    <textarea name="" id="" placeholder='comment..' className='w-full h-full border-1 border-black' 
                    onChange={(e)=>setMessage(e.target.value)}></textarea>
                  </div>
                  <div className=''>
                    <Button value="Post" type="submit" className=''></Button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          </CardAction>
        </CardHeader>
        <div className='flex w-full'>
          <div className='bg-gray-700 w-1/2'>
            <CardContent>
              <p>{msg.message}</p>
            </CardContent>
          </div>
          <div className='bg-red-500 w-1/2 text-center'>
            <CardFooter>
              <p>See reactios</p>
            </CardFooter>
          </div>
          
        </div>
        
        </Card>
      })
    }
  </>
  )
}

export default Room

