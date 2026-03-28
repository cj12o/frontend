import { Hash, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

type TopicType = {
  id: number;
  topic: string;
  relatedRooms: number;
};

type HomePageStats = {
  room_count: number;
  online_users_count: number;
  message_count: number;
  total_users_count: number;
};

interface TopicBarProps {
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  topics: TopicType[];
  homePageStats?: HomePageStats;
  getrooms: () => void;
  topicWiseRoom: (topic: string) => void;
}

export default function TopicBar({
  selectedTopic,
  setSelectedTopic,
  topics,
  homePageStats,
  getrooms,
  topicWiseRoom,
}: TopicBarProps) {
  const navigate = useNavigate();

  return (
    <div className="w-3/4 ">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100  sticky top-24">
        {/* <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Topics</h3>
          <Hash className="w-5 h-5 text-gray-400" />
        </div> */}

        <div className="opacity-90">
          {
            <button
              onClick={() => {
                getrooms();
                setSelectedTopic("all");
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                selectedTopic === "all"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{"All"}</span>
                <span
                  className={`text-sm ${
                    selectedTopic === "all"
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
              className={`w-full text-left px-2 py-1  transition ${
                selectedTopic === topic.topic
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "hover:bg-gray-50 text-gray-700 border-b-1 border-t-1 border-gray-700"
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
  );
}
