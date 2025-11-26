import React, { useEffect, useState } from 'react';
import { MessageSquare, Plus, Search, Users, TrendingUp, Hash, Clock, User, LogIn, UserPlus,Tags } from 'lucide-react';
import {roomlist,roomlistpost,roomlistprev} from "../backend/room_list.ts"
import { Link, useLocation } from 'react-router-dom';
import { addtoHistory } from '@/store/authSlice.ts';
import { getTopics } from '@/backend/topic.ts';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {Button} from '@/components/index.ts';
import { getRecommendations } from '@/backend/recommendation.ts';
import { delMember,addMember } from '@/backend/member.ts';
import Searchbar from '@/components/HomePage/Searchbar.tsx';
export default function ChatroomHome() {
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
    reason?:string,
    is_private:boolean,
    created_at:string,
    updated_at:string,
    tags:string [],
    isMember:boolean,
  }
  type TopicType={
    id:number,
    topic:string
  }
  type MemeberStatus={
    room_id:number,
    status:boolean
  }


  type dataForDynamicQuery={
    need:number,
    keyword:string
  }
  const authStatus=useSelector((state:any)=>state.authStatus)
  const [queryforDynamicSearch, setQueryforDynamicSearch] = useState<dataForDynamicQuery>({need:-1,keyword:""});
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [rooms,setRooms]=useState<RoomType[]>([])
  const [topics,setTopics]=useState<TopicType[]>([])
  const [aiStatus,setAiStatus]=useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

 ///FOR pagination
  const[nextpageStatus,setNextpageStatus]=useState(false)
  const[prevpageStatus,setPrevpageStatus]=useState(false)
  const [memberStatus,setMemberStatus]=useState<MemeberStatus []>([])
  const navigate=useNavigate()

  
  
  const getrooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await roomlist(queryforDynamicSearch?.need || -1, queryforDynamicSearch?.keyword || "");
      if (resp && resp.results) {
        setRooms(resp.results); 
        setNextpageStatus(!!resp.next);
        setPrevpageStatus(!!resp.previous);
      } else {
        setRooms([]);
        setError("No rooms found");
      }
    } catch (e: any) {
      console.error("Error fetching rooms:", e);
      setError(e.message || "Failed to load rooms. Please try again.");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  //todo:


  const getroomsNext = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await roomlistpost(queryforDynamicSearch?.need || -1, queryforDynamicSearch?.keyword || "");
      if (resp && resp.results) {
        setRooms(resp.results); 
        setNextpageStatus(!!resp.next);
        setPrevpageStatus(!!resp.previous);
      } else {
        setRooms([]);
        setError("No more rooms available");
      }
    } catch (e: any) {
      console.error("Error fetching next page:", e);
      setError(e.message || "Failed to load next page.");
    } finally {
      setLoading(false);
    }
  };



  const getroomsPrev = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await roomlistprev(queryforDynamicSearch?.need || -1, queryforDynamicSearch?.keyword || "");
      if (resp && resp.results) {
        setRooms(resp.results); 
        setNextpageStatus(!!resp.next);
        setPrevpageStatus(!!resp.previous);
      } else {
        setRooms([]);
        setError("No previous rooms available");
      }
    } catch (e: any) {
      console.error("Error fetching previous page:", e);
      setError(e.message || "Failed to load previous page.");
    } finally {
      setLoading(false);
    }
  };
  
  const getRecom = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp:{rooms:RoomType[]} = await getRecommendations();
      if (resp && resp.rooms) {
        setRooms(resp.rooms); 
      } else {
        setRooms([]);
        setError("No recommendations available");
      }
    } catch (e: any) {
      console.error("Error fetching recommendations:", e);
      setError(e.message || "Failed to load recommendations.");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const get_topics = async () => {
    try {
      const resp = await getTopics();
      if (resp && Array.isArray(resp)) {
        setTopics(resp); 
      } else {
        setTopics([]);
      }
    } catch (e: any) {
      console.error("Error fetching topics:", e);
      setTopics([]);
    }
  };
  

  const topicWiseRoom=async(topic:string)=>{
    //for parent topic
    setLoading(true);
    setError(null);
    try{
      const resp = await roomlist(2, topic);
      if (resp && resp.results) {
        setRooms(resp.results);
        setSelectedTopic(topic);
      } else {
        setRooms([]);
        setError(`No rooms found for topic: ${topic}`);
      }
    }catch(e: any){
      console.error("Error fetching topic rooms:", e);
      setError(e.message || `Failed to load rooms for topic: ${topic}`);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }

  const dispatch:any=useDispatch()
  //Todo :room to redux
  

  const location=useLocation()
  const extraclass="bg-white"
  useEffect(()=>{
    
    if(aiStatus==false){
      getrooms()
    }else{
      getRecom()
    }
    get_topics()
    console.log(`Rooms=>${rooms}`)
    
    
  },[aiStatus])
  
  const unsubscribe=(room_id:number)=>{
    delMember(room_id)
    getrooms()
  }
  const subscribe=(room_id:number)=>{
    addMember(room_id)
    getrooms()
  }
  //for search bar
  useEffect(()=>{
    getrooms()
  },[queryforDynamicSearch])
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Find Your Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join conversations that matter. Create rooms, connect with people, share ideas.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Searchbar value={{queryforDynamicSearch,setQueryforDynamicSearch}}/>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Rooms</p>
                <p className="text-3xl font-bold text-gray-900">{rooms.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Online Users</p>
                <p className="text-3xl font-bold text-gray-900">342</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Messages Today</p>
                <p className="text-3xl font-bold text-gray-900">8.2K</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Topics */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Topics</h3>
                <Hash className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                {
                  <button
                    onClick={() => topicWiseRoom("")}

                    
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedTopic === "All"
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{"All"}</span>
                      <span className={`text-sm ${
                        selectedTopic === "All" ? 'text-indigo-100' : 'text-gray-500'
                      }`}>
                        12
                      </span>
                    </div>
                  </button>
                }
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => topicWiseRoom(topic.topic)}

                    
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedTopic === topic.topic
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{topic.topic}</span>
                      <span className={`text-sm ${
                        selectedTopic === topic.topic ? 'text-indigo-100' : 'text-gray-500'
                      }`}>
                        12
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button className="w-full mt-6 flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-medium"
              onClick={()=>navigate("/createroom")}
              >
                <Plus className="w-5 h-5" />
                <span>Create Room</span>
              </button>
            </div>
          </div>

          {/* Main Content - Room List */}
        
          <div className="lg:col-span-3">
            <div className=' w-full h-12 rounded-xl mb-2 '>
              <Button value="Normal" className={!aiStatus?"m-1 rounded-xl ml-3 text-white":"m-1 rounded-xl ml-3 bg-white text-indigo-800"} onClick={()=>{
        
                setAiStatus(false)}
                }></Button>

              <Button value="Ask AI" className={aiStatus?"m-1 rounded-xl ml-3 text-white":"m-1 rounded-xl ml-3 bg-white text-indigo-800"}  onClick={()=>{
                if(!authStatus){
                  navigate("/login")
                }
                setAiStatus(true)}
                }></Button>  
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-red-800">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading rooms...</span>
              </div>
            )}

            <div className="space-y-4">
              {!loading && (
                <>
              {
                rooms.length>0?(
                rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-200 transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {
                        room.reason?
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-100">
                          <p className=' bg-white p-1 rounded-xl'>Recommendation :</p>
                          <p className="text-slate-700 leading-relaxed">
                            {room?.reason}
                          </p>
                        </div>
                        :null
                      }
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
                        <span className="flex items-center space-x-1">
                          <span>{`Category : ${room.parent_topic}`}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Tags className="w-4 h-4" />
                          {/* {
                            room.tags.length>0 && room.tags.map((t)=>{
                              return <span className='bg-red-200 p-1 rounded'>{t}</span>
                            })
                          } */}
                        <span className='bg-red-200 p-1 rounded'>{room.tags.length}</span>
                        </span>
                      </div>
                    </div>
                  </div>


                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {
                      room.is_private?(
                      <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition">
                        Request to Join
                      </button>
                      ):(
                        <button
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition"
                          onClick={() => {
                            // Update UI instantly
                            setRooms(prevRooms =>
                              prevRooms.map(r =>
                                r.id === room.id ? { ...r, isMember: !r.isMember } : r
                              )
                            );

                            
                            if (room.isMember) {
                              unsubscribe(Number(room.id));
                            } else {
                              subscribe(Number(room.id));
                            }
                          }}
                        >
                          {room.isMember ? "UnSub" : "Sub"}
                        </button>

                      )
                    }
                  </div>
                </div>
              ))):(
                  <div>
                    <h1 className='text-7xl '>No rooms related to this topic: {selectedTopic}</h1>
                  </div>
                )
              }
              <div className='flex w-full'>
                {
                  prevpageStatus?<button className='p-2 border-2 border-black rounded-md'
                  onClick={getroomsPrev}>Prev</button>:null
                }
                {
                  nextpageStatus?<button className='p-2 border-2 border-black rounded-md'
                  onClick={getroomsNext}>Next</button>:null
                }
              </div>
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 