import { useState, useEffect } from "react";
import { MessageSquare, Users, TrendingUp, ChevronDown } from "lucide-react";
import { getHomePageStats } from "@/backend/getStats.ts";

type HomePageStats = {
  room_count: number;
  online_users_count: number;
  message_count: number;
  total_users_count: number;
};

const StatsBar = () => {
  const [homePageStats, setHomePageStats] = useState<HomePageStats>();

  useEffect(() => {
    getHomePageStats().then((data) => setHomePageStats(data));
  }, []);

  return (
    <div className="flex bg-amber-200 inset-y-0 inset-x-0 justify-between mx-auto max-w-3xl h-[50px] overflow-hidden">
      <div>
        <button>rff</button>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-red-500 ">
        <div className="flex bg-white rounded-xl  shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm ">Active Rooms</p>
              <p className="text-xl font-bold text-gray-900">
                {homePageStats?.room_count}
              </p>
            </div>
            <div className="bg-indigo-100 p-2 rounded-sm">
              <MessageSquare className="w-3 h-3 text-indigo-600" />
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
    </div>
  );
};

export default StatsBar;
