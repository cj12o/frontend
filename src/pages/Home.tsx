import { useEffect, useState } from "react";
import { roomlist, roomlistpost, roomlistprev } from "../backend/room_list.ts";
import { requestJoin } from "../backend/join_request.ts";

// import { addtoHistory } from "@/store/authSlice.ts";
import { getTopics } from "@/backend/topic.ts";

import { useNavigate } from "react-router-dom";
import { getRecommendations } from "@/backend/recommendation.ts";
import { delMember, addMember } from "@/backend/member.ts";
import Searchbar from "@/components/HomePage/Searchbar.tsx";
import RoomList from "@/components/HomePage/RoomList.tsx";

import { useRoomContext } from "@/context/room_context.ts";
import { useAIModeContext } from "@/context/ai_mode_context.ts";
import StatsBar from "@/components/HomePage/StatsBar.tsx";
export default function ChatroomHome() {
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
  
  // const authStatus = useSelector((state: any) => state.authStatus);
  const [queryforDynamicSearch, setQueryforDynamicSearch] =
    useState<dataForDynamicQuery>({ need: -1, keyword: "" });
  const [selectedTopic, _setSelectedTopic] = useState("all");
  // const [rooms, setRooms] = useState<RoomType[]>([]);
  const { rooms, setRooms } = useRoomContext();
  const [_topics, setTopics] = useState<TopicType[]>([]);
  const { aiStatus } = useAIModeContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FOR pagination
  const [nextpageStatus, setNextpageStatus] = useState(false);
  const [prevpageStatus, setPrevpageStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const [memberStatus, setMemberStatus] = useState<MemeberStatus[]>([]);
  const navigate = useNavigate();

  const getrooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await roomlist(
        queryforDynamicSearch?.need || -1,
        queryforDynamicSearch?.keyword || "",
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
      const resp = await roomlistpost();
      if (resp && resp.results) {
        setRooms(resp.results);
        setNextpageStatus(!!resp.next);
        setPrevpageStatus(!!resp.previous);
        setCurrentPage((prev) => prev + 1);
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
      const resp = await roomlistprev();
      if (resp && resp.results) {
        setRooms(resp.results);
        setNextpageStatus(!!resp.next);
        setPrevpageStatus(!!resp.previous);
        setCurrentPage((prev) => Math.max(1, prev - 1));
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

  // const topicWiseRoom = async (topic: string) => {
  //   //for parent topic
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const resp = await roomlist(2, topic);
  //     if (resp && resp.results) {
  //       setRooms(resp.results);
  //       setSelectedTopic(topic);
  //     } else {
  //       setRooms([]);
  //       setError(`No rooms found for topic: ${topic}`);
  //     }
  //   } catch (e: any) {
  //     console.error("Error fetching topic rooms:", e);
  //     setError(e.message || `Failed to load rooms for topic: ${topic}`);
  //     setRooms([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleRequestJoin = async (room_id: string) => {
    try {
      await requestJoin(Number(room_id));
      // Update local state to show pending immediately
      setRooms(
        rooms.map((r) =>
          r.id === room_id ? { ...r, has_pending_request: true } : r,
        ),
      );
      // alert("Request sent successfully!");
    } catch (e: any) {
      console.error("Error sending request:", e);
      // alert(e.response?.data?.error || "Failed to send request.");
    }
  };

  // const dispatch: any = useDispatch();
  // //Todo :room to redux

  // const location = useLocation();
  // const extraclass = "bg-white";

  useEffect(() => {
    if (aiStatus == false) {
      getrooms();
    } else {
      getRecom();
    }
    get_topics();
    console.log(`Rooms=>${rooms}`);
  }, [aiStatus]);

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
    <div className="min-h-screen bg-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 antialiased [background:radial-gradient(125%_100%_at_50%_0%,#FFF_6%,#E0F0FF_30%,#E7EFFD_70%,#FFF_400%)]">
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
        <StatsBar />

        <div className="flex mx-auto gap-3 px-10">
          {/* Main Content - Room List */}

          <div className="px-4  w-full">
            <RoomList
              rooms={rooms}
              loading={loading}
              error={error}
              selectedTopic={selectedTopic}
              nextpageStatus={nextpageStatus}
              prevpageStatus={prevpageStatus}
              currentPage={currentPage}
              onError={setError}
              onNextPage={getroomsNext}
              onPrevPage={getroomsPrev}
              onRequestJoin={handleRequestJoin}
              onSubscribe={subscribe}
              onUnsubscribe={unsubscribe}
              onNavigate={navigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
