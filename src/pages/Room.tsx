import Chatbot from "./Chatbot.tsx";
import { useContext, useEffect, useState } from "react";
import { MessageSquare, X, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addtoHistory } from "@/store/authSlice";
import { getRoomdetail } from "@/backend/room.ts";
import type { Member } from "@/types/Room.type";
import type { Room as RoomType} from "@/types/Room_meta.types";
import { WebSocketContext } from "./WebSocketProvider";
import MessageComponent from "../components/Message.tsx";
import SenderComponent from "@/components/Sender.tsx";
import RoomSidebar from "@/components/RoomSidebar.tsx";

function Room() {
  const { id } = useParams();
  //const { sendMessage, lastJsonMessage }
  const { lastJsonMessage } = useContext(WebSocketContext);

  const [roomInfo, setRoomInfo] = useState<RoomType | null>(null);
  const [chatbotTab, setChatbotTab] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getRoomData = async (id: number) => {
    try {
      const room : RoomType = await getRoomdetail(id);
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
      setRoomInfo((prev:any) => {
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
    <div className="h-screen w-full overflow-hidden flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-purple-50">
      {roomInfo != null ? (
          <div className="flex h-full w-full">
            {/* Left Sidebar */}
            <RoomSidebar
              roomInfo={roomInfo}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              chatbotTab={chatbotTab}
              setChatbotTab={setChatbotTab}
            />

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            {/* Messages Display */}
            <div className="flex-1 min-h-0 overflow-y-auto relative z-10 custom-scrollbar">
              <MessageComponent />
            </div>

            {/* Message Input - pinned to bottom */}
            <div className="flex-shrink-0 bg-white/90 backdrop-blur-md border-t border-gray-200/50 shadow-[0_-2px_10px_-4px_rgba(0,0,0,0.06)] relative z-20">
              <SenderComponent />
            </div>
          </div>

          {/* Chatbot Sidebar */}
          {chatbotTab && (
            <div className="bg-gradient-to-b from-white/95 to-gray-50/80 backdrop-blur-xl w-96 h-full flex flex-col border-l border-gray-200/40 shadow-2xl z-30">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/30 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 backdrop-blur-sm">
                <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2.5">
                  <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  AI Assistant
                </h3>
                <button
                  onClick={() => setChatbotTab(false)}
                  className="p-2 hover:bg-gray-200/50 rounded-lg transition-colors duration-200 text-gray-500 hover:text-gray-700"
                  title="Close AI Assistant"
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
