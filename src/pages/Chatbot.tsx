import React, { createContext, useState, useEffect, useRef } from "react";
import Chatbot_reply from "../components/Chatbot_reply";
import { Bot, User } from "lucide-react";

const ChatbotContext = createContext<any>(null);

const Chatbot = ({ id }: { id: number }) => {
  const chatbotlogo = "http://127.0.0.1:8000/media/avatars/agent_XOcSxeh.jpg";

  const [llmResp, setLlmResp] = useState<Record<number, string>>({});
  const [query, setQuery] = useState<Record<number, string>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [llmResp, query]);

  console.log(`rendered roomid => ${id}`);

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <ChatbotContext.Provider value={{ setLlmResp, setQuery }}>
          <Chatbot_reply id={id} />
        </ChatbotContext.Provider>

        {Object.entries(llmResp).map(([key, value]) => {
          const profile_url = localStorage.getItem("profile_pic");

          return (
            <div
              key={key}
              className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {/* User message */}
              {query[key] && (
                <div className="flex justify-end items-end gap-2.5">
                  <div className="max-w-[80%] bg-gradient-to-br from-indigo-500 to-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md break-words shadow-md hover:shadow-lg transition-shadow duration-200">
                    <p className="text-sm leading-relaxed">{query[key]}</p>
                  </div>
                  <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-indigo-100 shadow-sm bg-white">
                    {profile_url ? (
                      <img
                        src={profile_url}
                        alt="User"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-indigo-100 to-purple-100">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bot message */}
              <div className="flex justify-start items-end gap-2.5">
                <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-100 shadow-sm bg-white">
                  <img
                    src={chatbotlogo}
                    alt="AI Assistant"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML =
                          '<div class="flex items-center justify-center h-full w-full bg-gradient-to-br from-purple-100 to-pink-100"><svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>';
                      }
                    }}
                  />
                </div>
                <div className="max-w-[80%] bg-white text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-md break-words shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                  <p className="text-sm leading-relaxed">{value}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default Chatbot;
export { ChatbotContext };
