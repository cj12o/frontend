import {
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Room} from "@/types/Room_meta.types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RoomSidebarProps {
  roomInfo: Room;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  chatbotTab: boolean;
  setChatbotTab: (open: boolean) => void;
}

export default function RoomSidebar({
  roomInfo,
  sidebarOpen,
  setSidebarOpen,
  chatbotTab,
  setChatbotTab,
}: RoomSidebarProps) {
  return (
    <aside
      className={`flex flex-col bg-white/95 backdrop-blur-xl border-r border-gray-200/40 shadow-sm transition-all duration-300 ease-out ${
        sidebarOpen ? "w-72" : "w-16"
      } overflow-hidden flex-shrink-0`}
    >
      {/* Room Info Header */}
      <div className="bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-white/80 border-b border-gray-200/30 px-4 py-3 flex-shrink-0">
        {sidebarOpen ? (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            <h2 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              {roomInfo.name}
            </h2>

            {/* Moderator Badge
            <div className="group flex items-center gap-2 text-xs bg-white/80 rounded-lg px-3 py-2 border border-amber-200/50 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200">
              <div className="p-1 bg-amber-50 rounded-md">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
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
                    >
                      {mod.username}
                      {idx < roomInfo.moderator.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </div>
              </div>
            </div> */}

            {/* Creator Badge */}
            <div className="group flex items-center gap-2 text-xs bg-white/80 px-3 py-2 border border-indigo-200/50 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200">
              <div className=" bg-indigo-50">
                <Users className="w-3.5 h-3.5 text-indigo-600 " />
              </div>
              <div className="w-fit">
                <div className="text-md text-black font-bold tracking-wide">
                  {"Creator =>"}
                </div>
              </div>
              <div className="flex-1">
                <Link
                  to={`/profile/${roomInfo.author.name}`}
                  className="text-[14px] font-medium text-blue-600 transition-colors truncate block"
                >
                  {roomInfo.author.name}
                </Link>
              </div>
            </div>

            {/* Moderation Type Badge */}
            <div
              className={`flex items-center gap-2 text-xs  px-3 py-2 border shadow-sm transition-all duration-200 ${
                roomInfo.moderation_type === 0
                  ? "bg-blue-50/80 border-blue-200/60"
                  : roomInfo.moderation_type === -1
                    ? "bg-purple-50/80 border-purple-200/60"
                    : "bg-green-10/80 border-green-200/60"
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
              />
              <div className="flex gap-5">
                <div className="text-md text-black font-semibold uppercase tracking-wide">
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
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Members List */}
      <ScrollArea className="flex-wrap ">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Users className="w-4 h-4 text-indigo-600" />
            {sidebarOpen && (
              <span className="text-xs font-semibold text-gray-700">
                Members ({roomInfo.members.length})
              </span>
            )}
          </div>

          <div className="space-y-1.5 flex">
            {roomInfo.members.map((member) => (
              <Link to={`/profile/${member.member_name}`} key={member.member_id}>
                <div
                  className={` w-fit group flex items-center gap-2.5 p-2 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-100 hover:shadow-sm ${
                    !sidebarOpen ? "justify-center" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {member.profile_image ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-200 border border-white">
                        <img
                          src={member.profile_image}
                          alt={member.member_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.classList.add(
                                "bg-gradient-to-br",
                                "from-indigo-400",
                                "to-purple-500",
                              );
                              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white font-bold text-xs">${member.member_name
                                .charAt(0)
                                .toUpperCase()}</div>`;
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm group-hover:scale-105 transition-transform duration-200">
                        {member.member_name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Status Indicator */}
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
                        member.status === true
                          ? "bg-emerald-400"
                          : member.status === false
                            ? "bg-amber-400"
                            : "bg-gray-300"
                      }`}
                    >
                      {member.status === true && (
                        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                      )}
                    </div>
                  </div>

                  {sidebarOpen && (
                    <div className="flex-1 min-w-0">
                      {/* <div className="font-medium text-sm text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
                        {member.member_name}
                      </div> */}
                      <div
                        className={`text-[10px] font-medium flex items-center gap-1 ${
                          member.status === true
                            ? "text-emerald-600"
                            : member.status === false
                              ? "text-amber-600"
                              : "text-gray-500"
                        }`}
                      >
                        {/* <div
                          className={`w-1 h-1 rounded-full ${
                            member.status === true
                              ? "bg-emerald-500"
                              : member.status === false
                                ? "bg-amber-500"
                                : "bg-gray-400"
                          }`}
                        /> */}
                        {/* {member.status === true
                          ? "Online"
                          : member.status === false
                            ? "Away"
                            : "Offline"} */}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Footer - Action Buttons */}
      <div className="p-3 space-y-2 border-t border-gray-200/30 bg-white/40 flex-shrink-0">
        <Button
          onClick={() => setChatbotTab(!chatbotTab)}
          variant={chatbotTab ? "default" : "outline"}
          size="sm"
          className={`w-full gap-2 ${
            chatbotTab
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/30"
              : ""
          } ${sidebarOpen ? "justify-start" : "justify-center px-0"}`}
        >
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          {sidebarOpen && "AI Assistant"}
        </Button>

        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="ghost"
          size="sm"
          className="w-full justify-center gap-2"
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              Collapse
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
