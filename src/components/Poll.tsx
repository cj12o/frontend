import React, { useEffect, useState,useContext } from 'react'
import {getPolls} from "../backend/polls.ts"
import { useParams ,Link} from 'react-router-dom'

import { WebSocketContext } from '../pages/WebSocketProvider';
const Poll = ({id}:{id:number}) => {

  const { sendMessage, lastJsonMessage } = useContext(WebSocketContext)
  type Poll={
    id:number,
    author:string,
    question : string,
    choices: string [],
    room: number
  }

  const [poll,setPolls]=useState<Poll|null>(null)
  

  const getpollsData=async(id:number)=>{
    const data=await getPolls(id)
    console.log(`POLL data:${data.question}`)
    setPolls(data)
  }

  useEffect(()=>{
    getpollsData(id)
  },[id])

  return (
    <>
      {
        poll?(
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full h-full">
              <Link to={`/profile/${poll.author}`} className='text-blue-900'>
                @{poll.author}
              </Link>
              <h2 className=" font-bold text-gray-800 mb-6 text-center">
                {poll.question}
              </h2>
              <div className="space-y-3 mb-6">
          {poll.choices?poll.choices.map((choice, index) => (
            <label
              key={index}
              className="flex items-center p-4 rounded-lg border-2 border-gray-200 cursor-pointer transition-all hover:border-indigo-300 hover:bg-gray-50"
            >
              <input
                type="radio"
                name="poll"
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-gray-700 text-sm font-medium">
                {choice}
              </span>
              </label>
            )):null}
          </div>
          </div>
        ):null}
    </>
  );
}

export default React.memo(Poll)