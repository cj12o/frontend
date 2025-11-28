import Chatbot from "./Chatbot.tsx";
import { useContext, useEffect, useState } from "react";
import {
  User,
  Crown,
  Users,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addtoHistory } from "@/store/authSlice";
import { getRoomdetail } from "@/backend/room.ts";
import { Link } from "react-router-dom";
import type { Room as RoomType, Moderator, Member } from "@/types/Room.types";
import { WebSocketContext } from "./WebSocketProvider";
import MessageComponent from "../components/Message.tsx";
import SenderComponent from "@/components/Sender.tsx";

function Room() {
  const { id } = useParams();
  const { sendMessage, lastJsonMessage } = useContext(WebSocketContext);

  const [roomInfo, setRoomInfo] = useState<RoomType | null>(null);
  const [chatbotTab, setChatbotTab] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getRoomData = async (id: number) => {
    try {
      const room = await getRoomdetail(id);
      setRoomInfo(room);
    } catch (e) {
      console.error(e);
    }
  };

  const dispatch = useDispatch();

  const handleStatus = () => {
    const username = lastJsonMessage?.["username"];
    const status = lastJsonMessage?.["status"];

    if (!username) return;

    console.log(`Websocket username:${username}`);
    if (username) {
      setRoomInfo((prev) => {
        if (prev) {
          return {
            ...prev,
            members: prev.members.map((mem: Member) => {
              return mem.member_name == username
                ? { ...mem, status: status }
                : mem;
            }),
          };
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    const start_time = Date.now();

    getRoomData(Number(id));

    return () => {
      const end_time = Date.now();
      const time_spent = end_time - start_time;
      console.log(`time spent in room ${time_spent}`);
      dispatch(addtoHistory({ id: id, time_spent: time_spent }));
    };
  }, [id]);

  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage.task == "user_status_update") {
      handleStatus();
    }
  }, [lastJsonMessage]);

  return (
    <div className="h-[calc(100vh-70px)] w-screen overflow-hidden flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-purple-100">
      {roomInfo != null ? (
        <div className="flex h-full w-full">
          {/* Left Sidebar */}
          <div
            className={`flex flex-col bg-white/80 backdrop-blur-2xl border-r border-white/50 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out ${
              sidebarOpen ? "w-80" : "w-20"
            } overflow-hidden z-20`}
          >
            {/* Room Info Header */}
            <div className="bg-white/50 backdrop-blur-sm border-b border-white/50 p-6 flex-shrink-0 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">
                  {roomInfo.name}
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm bg-white/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/60 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <Crown className="w-4 h-4 text-amber-500 flex-shrink-0 drop-shadow-sm" />
                    <span className="text-gray-700 font-medium">
                      {roomInfo.moderator.map((mod: Moderator) => (
                        <Link
                          key={mod.username}
                          to={`/profile/${mod.username}`}
                          className="hover:text-indigo-600 transition-colors duration-200 font-semibold"
                        >
                          {mod.username}{" "}
                        </Link>
                      ))}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm bg-white/60 backdrop-blur-md rounded-xl px-3 py-2 border border-white/60 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <User className="w-4 h-4 text-indigo-500 flex-shrink-0 drop-shadow-sm" />
                    <span className="text-gray-700">
                      Created by:{" "}
                      <Link
                        to={`/profile/${roomInfo.author.name}`}
                        className="hover:text-indigo-600 transition-colors duration-200 font-semibold"
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
              className="mx-4 mt-4 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4" />
              AI Assistant
            </button>

            {/* Toggle Sidebar Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mx-4 mt-2 px-4 py-3 bg-white/50 text-gray-600 font-semibold rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200/50 shadow-sm hover:shadow-md"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {sidebarOpen && "Collapse"}
            </button>

            {/* Members List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="p-2 bg-indigo-50 rounded-lg shadow-sm">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                {sidebarOpen && (
                  <h3 className="text-lg font-bold text-gray-800 tracking-tight">
                    Members
                    <span className="ml-2 text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full text-sm">
                      {roomInfo.members.length}
                    </span>
                  </h3>
                )}
              </div>

              <div className={`${sidebarOpen ? "space-y-2" : "space-y-3"}`}>
                {roomInfo.members.map((obj) => (
                  <Link to={`/profile/${obj.member_name}`} key={obj.member_id}>
                    <div
                      className={`group flex items-center gap-3 p-3 hover:bg-white hover:shadow-md hover:shadow-indigo-100/50 rounded-2xl transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-50 ${
                        !sidebarOpen && "justify-center"
                      }`}
                    >
                      <div className="relative">
                        <div className="w-11 h-11 bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 rounded-2xl flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform duration-200">
                          {obj.member_name.charAt(0).toUpperCase()}
                        </div>

                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-white shadow-sm ${
                            obj.status === true
                              ? "bg-emerald-400"
                              : obj.status === false
                              ? "bg-amber-400"
                              : "bg-gray-300"
                          }`}
                        />
                      </div>

                      {sidebarOpen && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
                              {obj.member_name}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              obj.status === true
                                ? "text-emerald-600"
                                : obj.status === false
                                ? "text-amber-600"
                                : "text-gray-500"
                            }`}
                          >
                            {obj.status === true
                              ? "● Online"
                              : obj.status === false
                              ? "● Away"
                              : "● Offline"}
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
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            {/* Messages Display */}
            <div className="flex-1 overflow-y-auto relative z-10 ">
              <MessageComponent />
            </div>

            {/* Message Input */}
            <div className="bg-white/80 backdrop-blur-xl border-t border-white/50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] relative z-20">
              <SenderComponent />
            </div>
          </div>

          {/* Chatbot Sidebar */}
          {chatbotTab && (
            <div className="bg-white/90 backdrop-blur-2xl w-96 h-full flex flex-col border-l border-white/50 shadow-2xl z-30">
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/50">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  AI Assistant
                </h3>
                <button
                  onClick={() => setChatbotTab(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-transparent">
                <Chatbot id={Number(id)} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/50">
              <Users className="w-10 h-10 text-indigo-600" />
            </div>
            <p className="text-gray-600 text-xl font-medium tracking-tight">
              Loading room...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Room;
