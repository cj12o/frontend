import { useState, useEffect } from "react";
import { MessageSquare, Users, TrendingUp } from "lucide-react";
import { getHomePageStats } from "@/backend/getStats.ts";
import { useAIModeContext } from "@/context/ai_mode_context";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

type HomePageStats = {
  room_count: number;
  online_users_count: number;
  message_count: number;
  total_users_count: number;
};

const StatsBar = () => {
  const [homePageStats, setHomePageStats] = useState<HomePageStats>();
  const { aiStatus, setAiStatus } = useAIModeContext();
  const authStatus = useSelector((state: any) => state.authStatus);
  const navigate = useNavigate();

  useEffect(() => {
    getHomePageStats().then((data) => setHomePageStats(data));
  }, []);

  const handleModeChange = (mode: boolean) => {
    if (mode && !authStatus) {
      navigate("/login");
    }
    setAiStatus(mode);
  };

  return (
    <div className=" p-4 items-center w-full">
    <div className="flex bg-amber-300 shadow-[0_5px_2px_-1px_rgba(0,0,0,0.6)] inset-y-0 inset-x-0 justify-between items-center mx-auto max-w-3xl h-[50px] overflow-hidden px-4 rounded-4xl">
      <div className="flex gap-2 bg-white rounded-2xl shadow-sm shadow-black border border-gray-100 p-1">
        <button
          onClick={() => handleModeChange(false)}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            !aiStatus
              ? "bg-blue-500 text-white rounded-l-2xl"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => handleModeChange(true)}
          className={`px-3 py-1 rounded text-sm font-medium transition ${
            aiStatus
              ? "bg-blue-500 text-white rounded-r-2xl"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Ask AI
        </button>
      </div>

      <div className="flex gap-4 justify-center">
        <div className="group flex bg-white rounded-4xl shadow-sm h-fit border shadow-black border-gray-100 hover:shadow-md transition px-2 py-1 items-center gap-2 hover:scale-104 ease-in-out duration-250 ">
          <div className="flex bg-indigo-300 p-1 rounded-sm flex-shrink-0 rounded-l-xl justify-center">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-sm font-bold tracking-tight text-gray-900 whitespace-nowrap">
            Active Rooms: 
          </p>
          <div className="text-indigo-600 group-hover:font-bold group-hover:text-xl">{homePageStats?.room_count}</div>
        </div>

        <div className="group flex bg-white rounded-4xl shadow-sm h-fit  shadow-black  border-gray-100 hover:shadow-md transition px-2 py-1 items-center gap-2 hover:scale-104 ease-in-out duration-250 ">
          <div className="bg-green-100 p-1 rounded-sm flex-shrink-0  rounded-l-xl justify-center">
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            Online: 
          </p>
          <div className="text-green-600 group-hover:font-bold group-hover:text-xl">{homePageStats?.online_users_count}/{homePageStats?.total_users_count}</div>
        </div>

        <div className="group flex bg-white rounded-4xl shadow-sm h-fit  shadow-black  border-gray-100 hover:shadow-md transition px-2 py-1 items-center gap-2 hover:scale-104 ease-in-out duration-250 ">
          <div className="bg-purple-100 p-1 rounded-sm  flex-shrink-0  rounded-l-xl justify-center">
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            Messages: 
          </p>
          <div className="text-purple-600 group-hover:font-bold group-hover:text-xl">{homePageStats?.message_count}</div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StatsBar;
