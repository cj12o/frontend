import React, { useContext, useState, useRef } from "react";
import { WebSocketContext } from "../pages/WebSocketProvider";
import { Send, Paperclip, Image as ImageIcon, X } from "lucide-react";
import { postMsg } from "@/backend/message";
import { useParams } from "react-router-dom";

export const Sender = () => {
  const { sendMessage } = useContext(WebSocketContext);
  const [input, setMainInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file && !image) return;

    if (file || image) {
      postMsg(Number(id), input, file, image);
    } else {
      const newReply = {
        message: input,
        parent: null,
      };
      sendMessage(JSON.stringify(newReply));
    }

    setMainInput("");
    setFile(null);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <div className="p-3 max-w-4xl mx-auto">
      {/* Preview Area */}
      {(file || image) && (
        <div className="flex gap-2 mb-2 px-2">
          {file && (
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm">
              <Paperclip className="w-3 h-3" />
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button
                onClick={() => setFile(null)}
                className="hover:text-indigo-900"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {image && (
            <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm">
              <ImageIcon className="w-3 h-3" />
              <span className="truncate max-w-[150px]">{image.name}</span>
              <button
                onClick={() => setImage(null)}
                className="hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-sm"
      >
        {/* Attachment Buttons */}
        <div className="flex items-center gap-1 pl-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
            title="Upload image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden Inputs */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          className="hidden"
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
        />

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setMainInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400 px-2"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!input.trim() && !file && !image}
          className={`p-2 rounded-xl transition-all duration-200 ${
            input.trim() || file || image
              ? "bg-indigo-600 text-white shadow-md hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Sender;
