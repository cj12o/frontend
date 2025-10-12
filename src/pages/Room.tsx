import React, { useEffect, useState } from 'react';
import { Send, User, Crown, Users } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addtoHistory } from '@/store/authSlice';
import { roomlist } from '@/backend/room';
import useWebSocket from 'react-use-websocket';
import { Link } from 'react-router-dom';
export default function ChatApp() {
  const {id}=useParams()
  //Todo :Websocket 
    const {sendMessage,lastSendMessage}=useWebSocket(`ws://127.0.0.1:8000/ws/chat/${id}/?token=${localStorage.getItem("cookie")||""}`)

  //Todo:end
   
    type author={
        id:number,
        name:string,
    }
    type member={
        member_name:string,
        member_id:number,
        status:boolean
    }
    type moderator={
        id:number,
        username:string,
        status:boolean
    }
    type Room={
        id:string,
        author:author,
        parent_topic:string,
        members:member [],
        moderator:moderator []
        name:string,
        description:string,
        topic:string,
        is_private:boolean,
        created_at:string,
        updated_at:string,
    }

  const [message, setMessage] = useState('');
  const [roomInfo,setRoomInfo]=useState<Room|null>(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: 'Alice',
      content: 'Hey everyone! Welcome to the chat room.',
      timestamp: '2:30 PM',
      upvotes: 5
    },
    {
      id: 2,
      author: 'Bob',
      content: 'Thanks! Excited to be here.',
      timestamp: '2:32 PM',
      upvotes: 3
    },
    {
      id: 3,
      author: 'Charlie',
      content: 'This is a great discussion about React and Tailwind!',
      timestamp: '2:35 PM',
      upvotes: 8
    }
  ]);



    const handleSend = () => {
        if (message.trim()) {
        const newMessage = {
            id: messages.length + 1,
            author: 'You',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            upvotes: 0
        };
        setMessages([...messages, newMessage]);
        setMessage('');
        }
    };

    const handleUpvote = (id:number) => {
        setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, upvotes: msg.upvotes + 1 } : msg
        ));
    };

    const location=useLocation()

    const getRoomData=async(id:number)=>{
        const room=await roomlist(id)
        setRoomInfo(room.rooms[0])
    }

    const dispatch=useDispatch()

    useEffect(()=>{
        const start_time=Date.now()
        
        getRoomData(Number(id))

        return()=>{
            const end_time=Date.now()
            const time_spent=end_time-start_time
            console.log(`time spent in room ${time_spent}`)
            dispatch(addtoHistory({"id":id,"time_spent":time_spent}))
        }
    },[])

    const sendMsgHandler=()=>{
        sendMessage(message)
        setMessage("")
        //update messages append newone
    }


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
                    <span>Moderator: {roomInfo.moderator.map((mod:moderator)=>{
                        return <span>{mod.username}</span>
                    })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-90">
                    <User className="w-4 h-4" />
                    <span>Created by: {roomInfo.author.name}</span>
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
                <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-indigo-100">
                    <div className="flex gap-4 p-5">
                        {/* Upvote Section */}
                        <div className="flex flex-col items-center gap-1 pt-1">
                        <button 
                            onClick={() => handleUpvote(msg.id)}
                            className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 transform hover:scale-110"
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 3l7 7h-4v7H7v-7H3l7-7z" />
                            </svg>
                        </button>
                        <span className="text-sm font-bold text-indigo-600">{msg.upvotes}</span>
                        </div>

                        {/* Message Content */}
                        <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-indigo-900">{msg.author}</span>
                            <span className="text-xs text-gray-400">{msg.timestamp}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {/* Message Input */}
                <div className="p-6 bg-white border-t border-indigo-100">
                <div className="flex gap-3 max-w-4xl mx-auto">
                    <form action="" onSubmit={sendMsgHandler}>
                        <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-6 py-3 rounded-full border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none transition-colors duration-200 bg-white"
                        />
                        <button
                        type='submit'
                        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                        >
                            <span>Send</span>
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    
                </div>
                </div>
            </div>
            </div>
        ):null
    }
    </>
  );
}