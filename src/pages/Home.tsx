import { useEffect, useState } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Users,
  TrendingUp,
  Hash,
  Clock,
  User,
  Tags,
} from "lucide-react";
import { roomlist, roomlistpost, roomlistprev } from "../backend/room_list.ts";
import { Link, useLocation } from "react-router-dom";
import { addtoHistory } from "@/store/authSlice.ts";
import { getTopics } from "@/backend/topic.ts";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/index.ts";
import { getRecommendations } from "@/backend/recommendation.ts";
import { delMember, addMember } from "@/backend/member.ts";
import { getHomePageStats } from "@/backend/getStats.ts";
import Searchbar from "@/components/HomePage/Searchbar.tsx";
export default function ChatroomHome() {
  type author = {
    id: number;
    name: string;
  };
  type member = {
    member_name: string;
    member_id: number;
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
  };
  type TopicType = {
    id: number;
    topic: string;
    relatedRooms: number;
  };
  // type MemeberStatus = {
  //   room_id: number;
  //   status: boolean;
  // };

  type dataForDynamicQuery = {
    need: number;
    keyword: string;
  };
  type HomePageStats = {
    room_count: number;
    online_users_count: number;
    message_count: number;
    total_users_count: number;
  };
  const authStatus = useSelector((state: any) => state.authStatus);
  const [queryforDynamicSearch, setQueryforDynamicSearch] =
    useState<dataForDynamicQuery>({ need: -1, keyword: "" });
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [topics, setTopics] = useState<TopicType[]>([]);
  const [aiStatus, setAiStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [homePageStats, setHomePageStats] = useState<HomePageStats>();
  ///FOR pagination
  const [nextpageStatus, setNextpageStatus] = useState(false);
  const [prevpageStatus, setPrevpageStatus] = useState(false);
  // const [memberStatus, setMemberStatus] = useState<MemeberStatus[]>([]);
  const navigate = useNavigate();

  const getrooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await roomlist(
        queryforDynamicSearch?.need || -1,
        queryforDynamicSearch?.keyword || ""
      );
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
      const resp = await roomlistpost(
        queryforDynamicSearch?.need || -1,
        queryforDynamicSearch?.keyword || ""
      );
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
      const resp = await roomlistprev(
        queryforDynamicSearch?.need || -1,
        queryforDynamicSearch?.keyword || ""
      );
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
      const resp: { rooms: RoomType[] } = await getRecommendations();
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

  const topicWiseRoom = async (topic: string) => {
    //for parent topic
    setLoading(true);
    setError(null);
    try {
      const resp = await roomlist(2, topic);
      if (resp && resp.results) {
        setRooms(resp.results);
        setSelectedTopic(topic);
      } else {
        setRooms([]);
        setError(`No rooms found for topic: ${topic}`);
      }
    } catch (e: any) {
      console.error("Error fetching topic rooms:", e);
      setError(e.message || `Failed to load rooms for topic: ${topic}`);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const dispatch: any = useDispatch();
  //Todo :room to redux

  const location = useLocation();
  const extraclass = "bg-white";

  useEffect(() => {
    if (aiStatus == false) {
      getrooms();
    } else {
      getRecom();
    }
    get_topics();
    console.log(`Rooms=>${rooms}`);
  }, [aiStatus]);

  useEffect(() => {
    getHomePageStats().then((data) => setHomePageStats(data));
    getrooms();
  }, []);
  const unsubscribe = (room_id: number) => {
    delMember(room_id);
    getrooms();
  };
  const subscribe = (room_id: number) => {
    addMember(room_id);
    getrooms();
  };

  //for search bar
  useEffect(() => {
    getrooms();
  }, [queryforDynamicSearch]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Find Your Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join conversations that matter. Create rooms, connect with people,
            share ideas.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Searchbar
              value={{ queryforDynamicSearch, setQueryforDynamicSearch }}
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Rooms</p>
                <p className="text-3xl font-bold text-gray-900">
                  {homePageStats?.room_count}
                </p>
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
                <p className="text-3xl font-bold text-gray-900">
                  {homePageStats?.online_users_count}/
                  {homePageStats?.total_users_count}
                </p>
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
                <p className="text-3xl font-bold text-gray-900">
                  {homePageStats?.message_count}
                </p>
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
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{"All"}</span>
                      <span
                        className={`text-sm ${
                          selectedTopic === "All"
                            ? "text-indigo-100"
                            : "text-gray-500"
                        }`}
                      >
                        {homePageStats?.room_count}
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
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{topic.topic}</span>
                      <span
                        className={`text-sm ${
                          selectedTopic === topic.topic
                            ? "text-indigo-100"
                            : "text-gray-500"
                        }`}
                      >
                        {topic.relatedRooms}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                className="w-full mt-6 flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-medium"
                onClick={() => navigate("/createroom")}
              >
                <Plus className="w-5 h-5" />
                <span>Create Room</span>
              </button>
            </div>
          </div>

          {/* Main Content - Room List */}

          <div className="lg:col-span-3">
            <div className="flex items-center bg-gray-100 p-1 rounded-xl mb-6 w-fit">
              <button
                onClick={() => setAiStatus(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !aiStatus
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => {
                  if (!authStatus) {
                    navigate("/login");
                  }
                  setAiStatus(true);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  aiStatus
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Ask AI
              </button>
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
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <div
                        key={room.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer group hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            {room.reason && (
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="bg-white px-2 py-1 rounded-md text-xs font-semibold text-indigo-600 shadow-sm">
                                    AI Recommendation
                                  </span>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-sm">
                                  {room.reason}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Link to={`/rooms/${room.id}/messages`}>
                                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                                    {room.name}
                                  </h4>
                                </Link>
                                {room.is_private ? (
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    Private
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                    Public
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {room.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                <Tags className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-gray-700">
                                  {room.topic}
                                </span>
                              </span>

                              <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>{room.author.name}</span>
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>{room.members.length} members</span>
                              </span>

                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>
                                  {new Date(
                                    room.updated_at
                                  ).toLocaleDateString()}
                                </span>
                              </span>

                              {room.tags.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Hash className="w-4 h-4 text-gray-400" />
                                  <span>{room.tags.length} tags</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end pt-4 mt-2 border-t border-gray-50">
                          {room.is_private ? (
                            <button className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition shadow-sm">
                              Request to Join
                            </button>
                          ) : (
                            <>
                              {room.isMember === true ? (
                                <button
                                  className="px-5 py-2 text-sm font-medium rounded-lg transition shadow-sm bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-red-600 hover:border-red-200"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    unsubscribe(Number(room.id));
                                  }}
                                >
                                  Leave Room
                                </button>
                              ) : (
                                <button
                                  className="px-5 py-2 text-sm font-medium rounded-lg transition shadow-sm bg-indigo-600 text-white hover:bg-indigo-700"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    subscribe(Number(room.id));
                                  }}
                                >
                                  Join Room
                                </button>
                              )}
                            </>
                          )}
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
                        onClick={() => navigate("/createroom")}
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
                        onClick={getroomsPrev}
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
                        onClick={getroomsNext}
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
        </div>
      </div>
    </div>
  );
}
