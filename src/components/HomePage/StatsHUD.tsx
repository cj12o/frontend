import { useState } from "react";
import { MessageSquare, Users, TrendingUp, ChevronUp } from "lucide-react";

type HomePageStats = {
  room_count: number;
  online_users_count: number;
  message_count: number;
  total_users_count: number;
};

type StatsHUDProps = {
  stats?: HomePageStats;
};

export default function StatsHUD({ stats }: StatsHUDProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-40">
      {!isCollapsed && (
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg mb-2 space-y-2 animate-in fade-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 text-xs">
            <div className="bg-indigo-50 p-1.5 rounded">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="font-semibold text-gray-900">{stats?.room_count}</span>
            <span className="text-gray-500">rooms</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="bg-green-50 p-1.5 rounded">
              <Users className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-semibold text-gray-900">
              {stats?.online_users_count}/{stats?.total_users_count}
            </span>
            <span className="text-gray-500">online</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="bg-purple-50 p-1.5 rounded">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-semibold text-gray-900">{stats?.message_count}</span>
            <span className="text-gray-500">msgs</span>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="bg-white/95 backdrop-blur-sm rounded-lg p-2 border border-gray-200 hover:border-gray-300 transition-colors shadow-lg"
        title={isCollapsed ? "Show stats" : "Hide stats"}
      >
        <ChevronUp
          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}
