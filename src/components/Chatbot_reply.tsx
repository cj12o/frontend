import React, { useContext, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { ChatbotContext } from "@/pages/Chatbot";
import { Send, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";

function Chatbot_reply({ id }: { id: number }) {
  console.log(`WS URL ws://127.0.0.1:8000/ws/chatbot/${id}/`);
  const { sendMessage, lastMessage } = useWebSocket(
    `ws://127.0.0.1:8000/ws/chatbot/${id}/?token=${
      localStorage.getItem("cookie") || ""
    }`
  );

  const { setLlmResp, setQuery } = useContext(ChatbotContext);
  const [question, setQuestion] = useState("");

  const sendQuery = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!question.trim()) return;
      sendMessage(question);
      setQuestion("");
    } catch (e) {
      console.log(`Error in chatbot:${e}`);
    }
  };
  useEffect(() => {
    if (lastMessage?.data) {
      if (JSON.parse(lastMessage.data)?.status === "done") {
        return;
      }
      const id = JSON.parse(lastMessage.data)["id"];

      if (
        lastMessage?.data != "done" &&
        JSON.parse(lastMessage.data)?.["isQuestion"] == true
      ) {
        setQuery((prev: any) => ({
          ...prev,
          [id]: JSON.parse(lastMessage.data)["token"],
        }));
      } else if (lastMessage?.data != "done") {
        // console.log(`ID:${id} and msg:${JSON.parse(lastMessage.data)["token"]}`)
        setLlmResp((prev: any) => ({
          ...prev,
          [id]: (prev[id] || "") + JSON.parse(lastMessage.data)["token"],
        }));
        // setLlmResp((prev:any)=>({...prev,[id]:prev[id]+lastMessage.data}))
      }
    }
  }, [lastMessage]);
  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-3 px-4">
      <form
        onSubmit={(e) => {
          sendQuery(e);
        }}
        className="relative"
      >
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 p-2">
          {/* AI Icon */}
          <div className="pl-2 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            placeholder="Ask AI anything..."
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 text-sm py-1.5 px-2"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!question.trim()}
            className={`flex-shrink-0 p-2.5 rounded-xl transition-all duration-200 ${
              question.trim()
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-[10px] text-gray-400 text-center mt-2 px-2">
          AI can make mistakes. Check important info.
        </p>
      </form>
    </div>
  );
}

export default Chatbot_reply;
