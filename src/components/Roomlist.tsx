import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { roomlist } from '@/backend/room'
import { Link } from 'react-router-dom'
import { MessageSquare, Plus, Search, Users, TrendingUp, Hash, Clock, User, LogIn, UserPlus,Tags } from 'lucide-react';


const Roomlist = () => {
    type author={
        id:number,
        name:string,
    }
    type member={
        member_name:string,
        member_id:number,
    }
    type moderator={
        id:number,
        username:string,
    }
    type RoomType={
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
    type TopicType={
        id:number,
        topic:string
    }
    
  
    const[rooms,setRooms]=useState<RoomType[]>([])
    const [topics,setTopics]=useState<TopicType[]>([])

  const navigate=useNavigate()

  
  const getrooms = async () => {
    try {
      const resp:{rooms:RoomType[]} = await roomlist();
      setRooms(resp?.rooms); 
    } catch (e) {
      console.log(e);
    }
  };
  


  const dispatch:any=useDispatch()
  //Todo :room to redux
  

    useEffect(()=>{
        getrooms()
        console.log(`Rooms=>${rooms}`)
    },[])

  return (
    <div className="lg:col-span-3">
            <div className="space-y-4">
              {
                rooms.length>0?(
                rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-200 transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
            
                        <Link to={`/rooms/${room.id}/messages`}>
                        <h4 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                          {room.name}
                        </h4>
                        </Link>
                        {room.is_private ?(
                            <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-green-700 text-xs font-medium rounded-full">
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                              <span>Private</span>
                            </span>
                          ):(
                            <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              <span>Public</span>
                            </span>
                          )}
                      </div>
                      <p className="text-gray-600 mb-3">{room.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1 ">
                          <Tags className="w-7 h-7 bg-red-200 rounded-full " />
                          <span>{room.topic}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{room.author.name}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span> members  :{room.members.length}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>lastActivity</span>
                        </span>
                      </div>
                    </div>
                  </div>


                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {
                      room.is_private?(
                      <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition opacity-0 group-hover:opacity-100">
                        Request to Join
                      </button>
                      ):(
                        <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition opacity-0 group-hover:opacity-100">
                        Join
                        </button>
                      )
                    }
                  </div>
                </div>
              ))):(
                  <div>
                    <h1 className='text-7xl '>No rooms related to this topic</h1>
                  </div>
                )
              }
            </div>
          </div>
  );
}

export default Roomlist