import React, { createContext, useState, useEffect, useRef } from 'react';
import Chatbot_reply from "../components/Chatbot_reply";

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
    <div className="flex flex-col h-full w-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <ChatbotContext.Provider value={{ setLlmResp, setQuery }}>
          <Chatbot_reply id={id}/>
        </ChatbotContext.Provider>

        {Object.entries(llmResp).map(([key, value]) => {
          const profile_url = localStorage.getItem("profile_pic");

          return (
            <div key={key} className="space-y-3">
              {/* User message */}
              {query[key] && <div className="flex justify-end items-end gap-2">
                <div className="max-w-[75%] bg-green-100 text-gray-800 px-4 py-2 rounded-2xl rounded-br-none break-words shadow-sm">
                  {query[key]}
                </div>
                <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                  {profile_url ? (
                    <img
                      src={profile_url}
                      alt=""
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-300 rounded-full text-lg">
                      👤
                    </div>
                  )}
                </div>
              </div>}
              

              {/* Bot message*/}
              <div className="flex justify-start items-end gap-2">
                <div className="h-9 w-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                  <img
                    src={chatbotlogo}
                    alt=""
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <div className="max-w-[75%] bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none break-words shadow-sm border border-gray-100">
                  {value}
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
