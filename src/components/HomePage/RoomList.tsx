import { MessageSquare, Hash, Tags, User, Clock } from "lucide-react";

type author = {
  id: number;
  name: string;
};

type member = {
  member_name?: string;
  member_id: number;
  profile_image?: string | null;
};

type moderator = {
  id: number;
  username: string;
};

type RoomType = {
  id: string;
  author: author;
  parent_topic: string;
  isMember: boolean;
  members: member[];
  moderator: moderator[];
  name: string;
  description: string;
  topic: string;
  reason?: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  tags: string[];
  has_pending_request: boolean;
};

interface RoomListProps {
  rooms: RoomType[];
  loading: boolean;
  error: string | null;
  selectedTopic: string;
  nextpageStatus: boolean;
  prevpageStatus: boolean;
  onError: (error: string | null) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onRequestJoin: (room_id: string) => void;
  onSubscribe: (room_id: number) => void;
  onUnsubscribe: (room_id: number) => void;
  onNavigate: (path: string) => void;
}

const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
};

const getTagColor = (index: number): string => {
  const colors = [
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-yellow-100 text-yellow-700 border-yellow-200",
    "bg-orange-100 text-orange-700 border-orange-200",
    "bg-teal-100 text-teal-700 border-teal-200",
    "bg-cyan-100 text-cyan-700 border-cyan-200",
  ];
  return colors[index % colors.length];
};

export default function RoomList({
  rooms,
  loading,
  error,
  selectedTopic,
  nextpageStatus,
  prevpageStatus,
  onError,
  onNextPage,
  onPrevPage,
  onRequestJoin,
  onSubscribe,
  onUnsubscribe,
  onNavigate,
}: RoomListProps) {
  return (
    <div className="w-full bg-amber-800 mx-auto px-4 py-3">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => onError(null)}
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

      <div className="space-y-4 ">
        {!loading && (
          <>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer group hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex-1">
                      {room.reason && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-2 mb-2 border border-blue-100">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="bg-white px-1.5 py-0.5 rounded text-[10px] font-semibold text-indigo-600 shadow-sm">
                              AI Recommendation
                            </span>
                          </div>
                          <p className="text-slate-700 leading-snug text-xs">
                            {room.reason}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div
                            onClick={() => {
                              if (room.is_private && !room.isMember) {
                                alert("Not yet accepted, please wait.");
                              } else {
                                onNavigate(`/rooms/${room.id}/messages`);
                              }
                            }}
                            className="cursor-pointer"
                          >
                            <h4 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition">
                              {room.name}
                            </h4>
                          </div>
                          {room.is_private ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-medium rounded-full border border-red-100">
                              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                              Private
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded-full border border-green-100">
                              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                              Public
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                        {room.description}
                      </p>

                      {/* Tags Display */}
                      {room.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {room.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${getTagColor(
                                index,
                              )}`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        {/* Parent Topic */}
                        {room.parent_topic && (
                          <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                            <Tags className="w-3 h-3" />
                            <span className="font-medium">
                              {room.parent_topic}
                            </span>
                          </span>
                        )}

                        {/* Topic */}
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
                          <Hash className="w-3 h-3 text-gray-400" />
                          <span className="font-medium text-gray-700">
                            {room.topic}
                          </span>
                        </span>

                        {/* Author */}
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span>{room.author.name}</span>
                        </span>

                        {/* Members with Profile Pictures */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex -space-x-2">
                            {room.members
                              .slice(0, 3)
                              .map((member, idx) => (
                                <div
                                  key={member.member_id}
                                  className="relative w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 hover:z-10 transition-transform cursor-pointer"
                                  title={
                                    member.member_name ||
                                    `Member ${member.member_id}`
                                  }
                                  style={{ zIndex: 3 - idx }}
                                >
                                  {member.profile_image ? (
                                    <img
                                      src={member.profile_image}
                                      alt={
                                        member.member_name || "Member"
                                      }
                                      className="w-full h-full rounded-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display =
                                          "none";
                                        const parent =
                                          e.currentTarget.parentElement;
                                        if (parent) {
                                          parent.classList.add(
                                            "bg-gradient-to-br",
                                            "from-indigo-400",
                                            "to-purple-500",
                                          );
                                          parent.innerHTML = `<span class="text-white text-[10px] font-bold flex items-center justify-center w-full h-full">${(
                                            member.member_name || "U"
                                          )
                                            .charAt(0)
                                            .toUpperCase()}</span>`;
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                                      {(member.member_name || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>
                                  )}
                                </div>
                              ))}
                            {room.members.length > 3 && (
                              <div
                                className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 text-[9px] font-bold shadow-sm"
                                title={`${
                                  room.members.length - 3
                                } more members`}
                              >
                                +{room.members.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-gray-500 text-xs">
                            {room.members.length}{" "}
                            {room.members.length === 1
                              ? "member"
                              : "members"}
                          </span>
                        </div>

                        {/* Last Activity */}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="font-medium text-gray-700">
                            {getTimeAgo(room.updated_at)}
                          </span>
                        </span>
                      
                        {room.isMember ? (
                      <button
                        className="px-5 py-2 text-sm font-medium rounded-lg transition shadow-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-red-600 hover:border-red-200"
                        onClick={(e) => {
                          e.preventDefault();
                          onUnsubscribe(Number(room.id));
                        }}
                      >
                        Leave Room
                      </button>
                    ) : room.is_private ? (
                      <button
                        className={`px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm ${
                          room.has_pending_request
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!room.has_pending_request)
                            onRequestJoin(room.id);
                        }}
                        disabled={room.has_pending_request}
                      >
                        {room.has_pending_request
                          ? "Request Pending"
                          : "Request to Join"}
                      </button>
                    ) : (
                      <button
                        className="px-5 py-2 text-sm font-medium rounded-lg transition shadow-sm bg-indigo-600 text-white hover:bg-indigo-700"
                        onClick={(e) => {
                          e.preventDefault();
                          onSubscribe(Number(room.id));
                        }}
                      >
                        Join Room
                      </button>
                    )}
                    </div>
                    
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No rooms found
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  {selectedTopic === "all"
                    ? "There are no rooms available right now. Why not create one?"
                    : `No rooms found for the topic "${selectedTopic}". Try selecting a different topic or create a new room.`}
                </p>
                <button
                  onClick={() => onNavigate("/createroom")}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm hover:shadow-md"
                >
                  Create a Room
                </button>
              </div>
            )}

            {/* Pagination */}
            {(prevpageStatus || nextpageStatus) && (
              <div className="flex items-center justify-center space-x-4 mt-8">
                <button
                  onClick={onPrevPage}
                  disabled={!prevpageStatus}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    prevpageStatus
                      ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={onNextPage}
                  disabled={!nextpageStatus}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    nextpageStatus
                      ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
