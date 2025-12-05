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
            className={`flex flex-col bg-gradient-to-b from-white via-white to-gray-50/50 backdrop-blur-2xl border-r border-gray-200/50 shadow-xl transition-all duration-300 ease-out ${
              sidebarOpen ? "w-80" : "w-20"
            } overflow-hidden z-20`}
          >
            {/* Room Info Header */}
            <div className="bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white border-b border-gray-200/50 p-5 flex-shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                {sidebarOpen && (
                  <div className="animate-in fade-in slide-in-from-left-3 duration-300">
                    <h2 className="text-xl font-bold mb-3 text-gray-900 tracking-tight flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                      {roomInfo.name}
                    </h2>

                    <div className="space-y-2">
                      {/* Moderator Badge */}
                      <div className="group flex items-center gap-2 text-xs bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-amber-200/50 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 cursor-pointer">
                        <div className="p-1 bg-amber-50 rounded-md">
                          <Crown className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-amber-600 font-semibold uppercase tracking-wide">
                            Moderator
                          </div>
                          <div className="text-gray-700 font-medium truncate">
                            {roomInfo.moderator.map((mod: Moderator, idx) => (
                              <Link
                                key={mod.username}
                                to={`/profile/${mod.username}`}
                                className="hover:text-indigo-600 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {mod.username}
                                {idx < roomInfo.moderator.length - 1
                                  ? ", "
                                  : ""}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Creator Badge */}
                      <div className="group flex items-center gap-2 text-xs bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-indigo-200/50 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 cursor-pointer">
                        <div className="p-1 bg-indigo-50 rounded-md">
                          <User className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wide">
                            Creator
                          </div>
                          <Link
                            to={`/profile/${roomInfo.author.name}`}
                            className="text-gray-700 font-medium hover:text-indigo-600 transition-colors truncate block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {roomInfo.author.name}
                          </Link>
                        </div>
                      </div>

                      {/* Moderation Type Badge */}
                      <div
                        className={`group flex items-center gap-2 text-xs backdrop-blur-sm rounded-lg px-3 py-2 border shadow-sm hover:shadow-md transition-all duration-200 ${
                          roomInfo.moderation_type === 0
                            ? "bg-blue-50/80 border-blue-200/60 hover:border-blue-300"
                            : roomInfo.moderation_type === -1
                            ? "bg-purple-50/80 border-purple-200/60 hover:border-purple-300"
                            : "bg-green-50/80 border-green-200/60 hover:border-green-300"
                        }`}
                      >
                        <div
                          className={`p-1 rounded-md ${
                            roomInfo.moderation_type === 0
                              ? "bg-blue-100"
                              : roomInfo.moderation_type === -1
                              ? "bg-purple-100"
                              : "bg-green-100"
                          }`}
                        >
                        </div>
                        <div className="flex-1">
                          <div
                            className={`text-[10px] font-semibold uppercase tracking-wide ${
                              roomInfo.moderation_type === 0
                                ? "text-blue-600"
                                : roomInfo.moderation_type === -1
                                ? "text-purple-600"
                                : "text-green-600"
                            }`}
                          >
                            Moderation
                          </div>
                          <div
                            className={`font-medium ${
                              roomInfo.moderation_type === 0
                                ? "text-blue-700"
                                : roomInfo.moderation_type === -1
                                ? "text-purple-700"
                                : "text-green-700"
                            }`}
                          >
                            {roomInfo.moderation_type === 0
                              ? "Manual"
                              : roomInfo.moderation_type === -1
                              ? "Semi-Auto"
                              : "Automatic"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 space-y-2 border-b border-gray-200/50 bg-white/50">
              {/* AI Assistant Button */}
              <button
                onClick={() => setChatbotTab(!chatbotTab)}
                className={`w-full px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] ${
                  chatbotTab
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/30"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                } ${!sidebarOpen && "justify-center"}`}
              >
                <MessageSquare className="w-4 h-4" />
                {sidebarOpen && "AI Assistant"}
              </button>

              {/* Toggle Sidebar Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-full px-3 py-2.5 bg-white/80 text-gray-600 font-semibold text-sm rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200 shadow-sm hover:shadow-md"
              >
                {sidebarOpen ? (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    Collapse
                  </>
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Members List */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-sm">
                  <Users className="w-4 h-4 text-white" />
                </div>
                {sidebarOpen && (
                  <h3 className="text-sm font-bold text-gray-800 tracking-tight flex items-center gap-2">
                    Members
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full text-xs">
                      {roomInfo.members.length}
                    </span>
                  </h3>
                )}
              </div>

              <div className={`${sidebarOpen ? "space-y-1.5" : "space-y-2"}`}>
                {roomInfo.members.map((obj) => (
                  <Link to={`/profile/${obj.member_name}`} key={obj.member_id}>
                    <div
                      className={`group flex items-center gap-2.5 p-2.5 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-100 hover:shadow-sm ${
                        !sidebarOpen && "justify-center"
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        {obj.profile_image ? (
                          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-200 border border-white">
                            <img
                              src={obj.profile_image}
                              alt={obj.member_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to gradient avatar if image fails
                                e.currentTarget.style.display = "none";
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.classList.add(
                                    "bg-gradient-to-br",
                                    "from-indigo-400",
                                    "to-purple-500"
                                  );
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-sm">${obj.member_name
                                    .charAt(0)
                                    .toUpperCase()}</div>`;
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-200">
                            {obj.member_name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        {/* Status Indicator */}
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-200 ${
                            obj.status === true
                              ? "bg-emerald-400 group-hover:scale-125"
                              : obj.status === false
                              ? "bg-amber-400 group-hover:scale-125"
                              : "bg-gray-300"
                          }`}
                        >
                          {obj.status === true && (
                            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                          )}
                        </div>
                      </div>

                      {sidebarOpen && (
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
                            {obj.member_name}
                          </div>
                          <div
                            className={`text-[10px] font-medium flex items-center gap-1 ${
                              obj.status === true
                                ? "text-emerald-600"
                                : obj.status === false
                                ? "text-amber-600"
                                : "text-gray-500"
                            }`}
                          >
                            <div
                              className={`w-1 h-1 rounded-full ${
                                obj.status === true
                                  ? "bg-emerald-500"
                                  : obj.status === false
                                  ? "bg-amber-500"
                                  : "bg-gray-400"
                              }`}
                            />
                            {obj.status === true
                              ? "Online"
                              : obj.status === false
                              ? "Away"
                              : "Offline"}
                          </div>
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
