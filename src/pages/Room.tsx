import Chatbot from './Chatbot.tsx';
import { useContext, useEffect, useState } from 'react';
import { User, Crown, Users, MessageSquare, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addtoHistory } from '@/store/authSlice';
import { getRoomdetail } from '@/backend/room.ts';
import { Link } from 'react-router-dom';
import type { Room as RoomType, Moderator, Member } from '@/types/Room.types';
import { WebSocketContext } from './WebSocketProvider';
import MessageComponent from "../components/Message.tsx"
import SenderComponent from '@/components/Sender.tsx';

function Room() {
  const { id } = useParams()
  const { sendMessage, lastJsonMessage } = useContext(WebSocketContext)

  const [roomInfo, setRoomInfo] = useState<RoomType | null>(null)
  const [chatbotTab, setChatbotTab] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const getRoomData = async (id: number) => {
    try {
      const room = await getRoomdetail(id)
      setRoomInfo(room)
    } catch (e) {
      console.error(e)
    }
  }

  const dispatch = useDispatch()

  const handleStatus = () => {
    const username = lastJsonMessage?.["username"]
    const status = lastJsonMessage?.["status"]

    if (!username) return

    console.log(`Websocket username:${username}`)
    if (username) {
      setRoomInfo((prev) => {
        if (prev) {
          return {
            ...prev,
            members: prev.members.map((mem: Member) => {
              return mem.member_name == username ? { ...mem, status: status } : mem
            })
          }
        }
        return prev
      })
    }
  }

  useEffect(() => {
    const start_time = Date.now()

    getRoomData(Number(id))

    return () => {
      const end_time = Date.now()
      const time_spent = end_time - start_time
      console.log(`time spent in room ${time_spent}`)
      dispatch(addtoHistory({ "id": id, "time_spent": time_spent }))
    }
  }, [id])

  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.task == "user_status_update") {
      handleStatus()
    }
  }, [lastJsonMessage])

  return (
    <div className='h-[calc(100vh-70px)] w-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      {
        roomInfo != null ? (
          <div className="flex h-full w-full">
            {/* Left Sidebar */}
            <div className={`flex flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out ${
              sidebarOpen ? 'w-80' : 'w-20'
            } overflow-hidden`}>
              {/* Room Info Header */}
              <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white p-6 flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">{roomInfo.name}</h2>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                      <Crown className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                      <span className="text-white/90 font-medium">
                        {roomInfo.moderator.map((mod: Moderator) => (
                          <Link
                            key={mod.username}
                            to={`/profile/${mod.username}`}
                            className='hover:text-yellow-200 transition-colors duration-200 font-semibold'
                          >
                            {mod.username} {" "}
                          </Link>
                        ))}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                      <User className="w-4 h-4 text-blue-200 flex-shrink-0" />
                      <span className="text-white/90">
                        Created by:{" "}
                        <Link
                          to={`/profile/${roomInfo.author.name}`}
                          className='hover:text-blue-200 transition-colors duration-200 font-semibold'
                        >
                          {roomInfo.author.name}
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chatbot Toggle Button */}
              <button
                onClick={() => setChatbotTab(!chatbotTab)}
                className="mx-4 mt-4 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                AI Assistant
              </button>

              {/* Toggle Sidebar Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mx-4 mt-2 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                {sidebarOpen && 'Collapse'}
              </button>

              {/* Members List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  {sidebarOpen && (
                    <h3 className="text-lg font-bold text-gray-800">
                      Members
                      <span className="ml-2 text-purple-600 font-bold">({roomInfo.members.length})</span>
                    </h3>
                  )}
                </div>

                <div className={`${sidebarOpen ? 'space-y-2' : 'space-y-3'}`}>
                  {roomInfo.members.map((obj) => (
                    <Link to={`/profile/${obj.member_name}`} key={obj.member_id}>
                      <div className={`group flex items-center gap-3 p-3 hover:bg-purple-50 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-md ${!sidebarOpen && 'justify-center'}`}>
                        <div className="relative">
                          <div className="w-11 h-11 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                            {obj.member_name.charAt(0).toUpperCase()}
                          </div>

                          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-3 border-white shadow-lg transition-colors duration-200 ${
                            obj.status === true ? 'bg-emerald-400' :
                              obj.status === false ? 'bg-amber-400' : 'bg-gray-300'
                          }`} />
                        </div>

                        {sidebarOpen && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 truncate">{obj.member_name}</span>
                            </div>
                            <span className={`text-xs font-medium ${
                              obj.status === true ? 'text-emerald-600' :
                                obj.status === false ? 'text-amber-600' : 'text-gray-500'
                            }`}>
                              {obj.status === true ? '● Online' : obj.status === false ? '● Away' : '● Offline'}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Messages Display */}
              <div className="flex-1 overflow-y-auto">
                <MessageComponent />
              </div>

              {/* Message Input */}
              <div className='bg-white border-t border-gray-200 shadow-xl'>
                <SenderComponent />
              </div>
            </div>

            {/* Chatbot Sidebar */}
            {chatbotTab && (
              <div className='bg-white w-96 h-full flex flex-col border-l border-gray-200 shadow-2xl animate-in slide-in-from-right duration-300'>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <h3 className="font-bold text-gray-900 text-lg">AI Assistant</h3>
                  <button
                    onClick={() => setChatbotTab(false)}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-purple-50">
                  <Chatbot id={id} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-white/70 text-lg font-medium">Loading room...</p>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Room