import { useState } from "react";
import { MessageSquare, Users, TrendingUp, ChevronDown } from "lucide-react";

type HomePageStats = {
  room_count: number;
  online_users_count: number;
  message_count: number;
  total_users_count: number;
};

type StatsBarProps = {
  stats?: HomePageStats;
};

export default function StatsBar({ stats }: StatsBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors mb-2"
      >
        <span className="text-sm font-medium text-gray-700">Statistics</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isCollapsed ? "-rotate-90" : ""
          }`}
        />
      </button>

      {!isCollapsed && (
        <div className="grid grid-cols-3 gap-3 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-1">Active Rooms</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.room_count}
                </p>
              </div>
              <div className="bg-indigo-50 p-2 rounded-md flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-green-200 transition-colors">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-1">Online Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.online_users_count}/{stats?.total_users_count}
                </p>
              </div>
              <div className="bg-green-50 p-2 rounded-md flex-shrink-0">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-100 hover:border-purple-200 transition-colors">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-1">Messages Today</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.message_count}
                </p>
              </div>
              <div className="bg-purple-50 p-2 rounded-md flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
