import {
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Hash,
  Zap,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Room} from "@/types/Room_meta.types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { boostRoom } from "@/backend/room";

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
  const [boosting, setBoosting] = useState(false);
  const [boostMsg, setBoostMsg] = useState("");

  const handleBoost = async () => {
    setBoosting(true);
    setBoostMsg("");
    try {
      const res = await boostRoom(Number(roomInfo.id));
      setBoostMsg(`Boosted! (${res.tool_called})`);
    } catch (e: any) {
      setBoostMsg(
        e.message === "rate_limited"
          ? "Rate limited. Try later."
          : "Boost failed."
      );
    } finally {
      setBoosting(false);
      setTimeout(() => setBoostMsg(""), 4000);
    }
  };

  return (
    <aside
      className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-out ${
        sidebarOpen ? "w-72" : "w-16"
      } overflow-hidden flex-shrink-0`}
    >
      {/* Room Info Header */}
      <div className="border-b border-gray-200 px-4 py-3 flex-shrink-0">
        {sidebarOpen ? (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            <h2 className="text-2xl font-bold text-gray-900 underline flex items-center gap-2">
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
            <div className="flex items-center gap-2 text-xs px-3 py-2 border border-b-gray-800 border-t-white border-r-gray-200 hover:border-2 hover:border-gray-800 transition-all duration-200">
              <Users className="size-4 rounded-full bg-amber-200 m-1" />
              <span className="text-md text-black font-semibold">Creator</span>
              <Link
                to={`/profile/${roomInfo.author.name}`}
                className="text-sm font-medium text-blue-600 transition-colors truncate"
              >
                {roomInfo.author.name}
              </Link>
            </div>

            {/* Moderation Type Badge */}
            <div className="flex items-center gap-2 text-xs px-3 py-2 border border-b-gray-800 border-t-white border-r-gray-200 hover:border-2 hover:border-gray-800 transition-all duration-200">
              <Hash className="size-4 rounded-full bg-amber-200 m-1" />
              <span className="text-md text-black font-semibold uppercase tracking-wide">
                Moderation
              </span>
              <span
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
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Hash className="size-4 rounded-full bg-amber-200" />
          </div>
        )}
      </div>

      {/* Members List */}
      <ScrollArea className="flex-wrap ">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Users className="size-4" />
            {sidebarOpen && (
              <span className="text-xs font-bold text-gray-900">
                Members ({roomInfo.members.length})
              </span>
            )}
          </div>

          <div className="space-y-1.5 flex">
            {roomInfo.members.map((member) => (
              <Link to={`/profile/${member.member_name}`} key={member.member_id}>
                <div
                  className={`w-fit group flex items-center gap-2.5 p-2 rounded-lg transition-all duration-200 cursor-pointer border border-b-gray-800 border-t-white border-r-gray-200 hover:border-2 hover:border-gray-800 ${
                    !sidebarOpen ? "justify-center" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {member.profile_image ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
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
                      <div className="w-8 h-8 bg-amber-200 text-gray-900 rounded-full flex items-center justify-center font-bold text-xs border border-gray-200">
                        {member.member_name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Status Indicator */}
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        member.status === true
                          ? "bg-emerald-400"
                          : member.status === false
                            ? "bg-amber-400"
                            : "bg-gray-300"
                      }`}
                    >
                      {member.status === true && (
                        <div className="absolute inset-0 bg-emerald-400 rounded-full" />
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
      <div className="p-3 space-y-2 border-t border-gray-200 flex-shrink-0">
        <Button
          onClick={() => setChatbotTab(!chatbotTab)}
          variant={chatbotTab ? "default" : "outline"}
          size="sm"
          className={`w-full gap-2 ${
            chatbotTab
              ? "border-2 border-gray-800"
              : "border border-b-gray-800 border-t-white border-r-gray-200"
          } ${sidebarOpen ? "justify-start" : "justify-center px-0"}`}
        >
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          {sidebarOpen && "AI Assistant"}
        </Button>

        <Button
          onClick={handleBoost}
          disabled={boosting}
          variant="outline"
          size="sm"
          className={`w-full gap-2 border border-b-gray-800 border-t-white border-r-gray-200 ${sidebarOpen ? "justify-start" : "justify-center px-0"}`}
        >
          {boosting ? (
            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          ) : (
            <Zap className="w-4 h-4 flex-shrink-0" />
          )}
          {sidebarOpen && (boosting ? "Boosting..." : "Boost Room")}
        </Button>
        {boostMsg && sidebarOpen && (
          <p className="text-xs text-center text-gray-500">{boostMsg}</p>
        )}

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
