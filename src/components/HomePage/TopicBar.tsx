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

// export default function TopicBar({
//   selectedTopic,
//   setSelectedTopic,
//   topics,
//   homePageStats,
//   getrooms,
//   topicWiseRoom,
// }: TopicBarProps) {
//   const navigate = useNavigate();

//   return (
//     <div className="w-3/4 ">
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100  sticky top-24">
//         {/* <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-semibold text-gray-900">Topics</h3>
//           <Hash className="w-5 h-5 text-gray-400" />
//         </div> */}

//         <div className="opacity-10">
//           {
//             <button
//               onClick={() => {
//                 getrooms();
//                 setSelectedTopic("all");
//               }}
//               className={`w-full text-left px-4 py-3 rounded-lg transition ${
//                 selectedTopic === "all"
//                   ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
//                   : "hover:bg-gray-50 text-gray-700"
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <span className="font-medium">{"All"}</span>
//                 <span
//                   className={`text-sm ${
//                     selectedTopic === "all"
//                       ? "text-indigo-100"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   {homePageStats?.room_count}
//                 </span>
//               </div>
//             </button>
//           }
//           {topics.map((topic) => (
//             <button
//               key={topic.id}
//               onClick={() => topicWiseRoom(topic.topic)}
//               className={`w-full text-left px-2 py-1  transition ${
//                 selectedTopic === topic.topic
//                   ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
//                   : "hover:bg-gray-50 text-gray-700 border-b-1 border-t-1 border-gray-700"
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <span className="font-medium">{topic.topic}</span>
//                 <span
//                   className={`text-sm ${
//                     selectedTopic === topic.topic
//                       ? "text-indigo-100"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   {topic.relatedRooms}
//                 </span>
//               </div>
//             </button>
//           ))}
//         </div>

//         <button
//           className="w-full mt-6 flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-medium"
//           onClick={() => navigate("/createroom")}
//         >
//           <Plus className="w-5 h-5" />
//           <span>Create Room</span>
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function TopicBar({
  selectedTopic,
  setSelectedTopic,
  topics,
  homePageStats,
  getrooms,
  topicWiseRoom,
}: TopicBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // 🔍 Filter topics (spotlight style)
  const filteredTopics = useMemo(() => {
    if (!query) return topics;
    return topics.filter((t) =>
      t.topic.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, topics]);

  return (
    <div className="w-3/4">
      <div className="sticky top-24">

        {/* 🌈 Outer glow border */}
        <div className="rounded-3xl p-[1px] bg-gradient-to-b from-white/20 via-white/10 to-transparent">

          {/* 🧊 Glass container */}
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20
                          shadow-[0_10px_40px_rgba(0,0,0,0.5)]
                          rounded-3xl p-4 overflow-hidden">

            {/* ✨ Depth layer (inner light reflection) */}
            <div className="absolute inset-0 rounded-3xl bg-white/5 pointer-events-none" />

            {/* 🔍 Spotlight Search */}
            <div className="relative mb-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl 
                              bg-white/10 border border-white/10 backdrop-blur-md">
                <Search className="w-4 h-4 text-white/60" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-white/90 
                             placeholder:text-white/40 w-full"
                />
              </div>
            </div>

            {/* 📌 Topics List */}
            <div className="relative max-h-72 overflow-y-auto pr-1 space-y-1
                            scroll-smooth
                            [&::-webkit-scrollbar]:hidden">

              {/* Animated selection pill */}
              <motion.div
                layoutId="active-pill"
                className="absolute left-0 right-0 h-10 rounded-xl bg-white/20 
                           backdrop-blur-md z-0"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  top:
                    selectedTopic === "all"
                      ? 0
                      : (filteredTopics.findIndex(
                          (t) => t.topic === selectedTopic
                        ) +
                          1) *
                        44,
                }}
              />

              {/* ALL */}
              <button
                onClick={() => {
                  getrooms();
                  setSelectedTopic("all");
                }}
                className="relative z-10 w-full text-left px-4 py-2.5 rounded-xl 
                           text-white/90 hover:bg-white/10 transition"
              >
                <div className="flex justify-between">
                  <span>All</span>
                  <span className="text-white/60 text-sm">
                    {homePageStats?.room_count}
                  </span>
                </div>
              </button>

              {/* TOPICS */}
              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic.topic);
                    topicWiseRoom(topic.topic);
                  }}
                  className="relative z-10 w-full text-left px-4 py-2.5 rounded-xl 
                             text-white/90 hover:bg-white/10 transition"
                >
                  <div className="flex justify-between">
                    <span>{topic.topic}</span>
                    <span className="text-white/60 text-sm">
                      {topic.relatedRooms}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* ➕ Create Room */}
            <button
              onClick={() => navigate("/createroom")}
              className="mt-4 w-full flex items-center justify-center gap-2
                         px-4 py-3 rounded-xl font-medium text-white
                         bg-white/10 hover:bg-white/20 transition
                         border border-white/10 backdrop-blur-md"
            >
              <Plus className="w-5 h-5" />
              Create Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}