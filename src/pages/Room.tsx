import { useContext, useEffect, useState } from 'react';
import { User, Crown, Users } from 'lucide-react';
import {  useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addtoHistory } from '@/store/authSlice';
import { roomlist } from '@/backend/room';
import { Link } from 'react-router-dom';
import type { Room as RoomType ,Moderator,Member} from '@/types/Room.types';

import {WebSocketContext} from './WebSocketProvider';
import MessageComponent from "../components/Message.tsx"
function Room() {
  const {id}=useParams()
  //Todo :Websocket 
    const {sendMessage,lastJsonMessage}=useContext(WebSocketContext)
    
  //Todo:end
  const [roomInfo,setRoomInfo]=useState< RoomType |null>(null)

    

    const getRoomData=async(id:number)=>{
        try{
            const room=await roomlist(id)
            setRoomInfo(room.rooms[0])
        }catch(e){

        }
    }

    const dispatch=useDispatch()



    const handleStatus = () => {
        const username=lastJsonMessage?.["username"]
        const status=lastJsonMessage?.["status"]

        if(!username) return 

        console.log(`Websocket username:${username}`)
        if (username){
            setRoomInfo((prev)=>{
                if(prev){
                    return {...prev,
                        members:prev.members.map((mem:Member)=>{
                            return mem.member_name==username?{...mem,status:status}:mem
                        })
                    }
                }
                return prev
            })
        }
        
    }

    useEffect(()=>{
        const start_time=Date.now()
        
        getRoomData(Number(id))
    
        return()=>{
            const end_time=Date.now()
            const time_spent=end_time-start_time
            console.log(`time spent in room ${time_spent}`)
            dispatch(addtoHistory({"id":id,"time_spent":time_spent}))
        }
    },[id])

    

    useEffect(()=>{
        if(lastJsonMessage &&  lastJsonMessage.message=="user_status_update"){
            handleStatus()
        }
    },[lastJsonMessage])
  return ( 
    <>
    {
        roomInfo!=null?
        (
            <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
            {/* Left Sidebar */}
            <div className="w-80 flex flex-col shadow-xl">
                {/* Room Info - Upper Section */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 h-44">
                <h2 className="text-2xl font-bold mb-3">{roomInfo.name}</h2>
                <div className="flex items-center gap-2 text-sm mb-2 opacity-90">
                    <Crown className="w-4 h-4 text-yellow-300" />
                    <span>Moderator: {roomInfo.moderator.map((mod:Moderator)=>{
                        return <span>{mod.username}</span>
                    })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-90">
                    <User className="w-4 h-4" />
                    <span>Created by: {roomInfo.author.username}</span>
                </div>
                </div>

                {/* Members - Lower Section */}
                <div className="bg-white p-6 flex-1 overflow-y-auto border-r border-indigo-100">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-xl font-bold text-indigo-900">Members ({roomInfo.members.length})</h3>
                </div>
                <div className="space-y-2">
                    {roomInfo.members.map((obj) => (
                    <Link to={`/profile/${obj.member_name}`}>
                        <div key={obj.member_id} className="flex items-center gap-3 p-3 hover:bg-indigo-50 rounded-lg transition-all duration-200 cursor-pointer">
                        <div className="relative">
                        
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                                {obj.member_name.charAt(0).toUpperCase()}
                            </div>
                        
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                            obj.status === true ? 'bg-green-400' :
                            obj.status === false ? 'bg-yellow-400' : 'bg-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800">{obj.member_name}</span>
                            
                        </div>
                        {
                            obj.status?<span className="text-xs text-gray-500 capitalize">Online</span>:<span className="text-xs text-gray-500 capitalize">Offline</span>
                        }
                        </div>
                    </div>
                    </Link>
                    ))}
                </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Messages Display */}
                <div className="flex-1 overflow-y-auto p-8">
                    <MessageComponent/>
                    <div className='bg-red-500'>
                    </div>
                </div>
                {/* Message Input */}
            </div>
            </div>
        ):null
    }
    </>
  );
}

export default Room