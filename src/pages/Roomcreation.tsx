import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { Plus, X, Lock, Globe, Tag, Sparkles } from "lucide-react";
import Search from "@/components/Search";
import { createRoom } from "@/backend/room";
import type { Moderator } from "@/types/Room.types";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState("");
  const [topic, setTopic] = useState("");
  const [privateStatus, setPrivateStatus] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  //todo: mods
  const [moderator, setModerator] = useState<Moderator[]>([]);

  //todo

  useEffect(() => {
    if (error.length > 0) {
      setError("");
    }
  }, [tags, error]);

  const submitHandler = async () => {
    setLoading(true);
    const resp = await createRoom(
      roomName,
      roomDescription,
      topic,
      privateStatus,
      tags,
      moderator.map((mod)=>mod.id)
    );
    if (resp === 200) {
      setLoading(false);
      alert("Room created successfully");
    } else {
      setLoading(false);
      setError("Room creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 flex justify-center items-center">
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">
              Creating your room...
            </p>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-2xl border border-white/50">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New Room
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-14">
            Set up your community space
          </p>
        </div>

        {error.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Room Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Room Name
            </label>
            <input
              type="text"
              placeholder="Enter a catchy room name"
              className="border border-gray-200 px-4 py-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white/50 backdrop-blur-sm"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Topic
            </label>
            <input
              type="text"
              placeholder="What's this room about?"
              className="border border-gray-200 px-4 py-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white/50 backdrop-blur-sm"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your room's purpose and guidelines"
              className="border border-gray-200 px-4 py-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white/50 backdrop-blur-sm h-28 resize-none"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
            />
          </div>

          {/* Private Toggle */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              {privateStatus ? (
                <Lock className="w-5 h-5 text-indigo-600" />
              ) : (
                <Globe className="w-5 h-5 text-gray-600" />
              )}
              <div>
                <label className="text-sm font-semibold text-gray-700 block">
                  {privateStatus ? "Private Room" : "Public Room"}
                </label>
                <p className="text-xs text-gray-500">
                  {privateStatus
                    ? "Only invited members can join"
                    : "Anyone can discover and join"}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={privateStatus}
                onChange={(e) => setPrivateStatus(!privateStatus)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <input
              type="text"
              placeholder="Add tags and press Enter"
              className="border border-gray-200 px-4 py-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white/50 backdrop-blur-sm"
              value={tag}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault();
                  if (tag != "") {
                    if (tags.find((tagg) => tagg === tag)) {
                      setError("Already chosen tag");
                      return;
                    }
                    setTags((prev) => [...prev, tag]);
                  }
                  setTag("");
                }
              }}
              onChange={(e) => {
                setTag(e.target.value);
              }}
            />

            {/* Tag Chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.length > 0
                ? tags.map((tag: string, i) => {
                    if (tag !== "") {
                      return (
                        <div
                          key={i}
                          className="group flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all"
                        >
                          <span className="text-sm font-medium">{tag}</span>
                          <button
                            onClick={() =>
                              setTags((prev) =>
                                prev.filter((ele) => ele !== tag)
                              )
                            }
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5 text-indigo-600 hover:text-indigo-800" />
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })
                : null}
            </div>
          </div>

          {/* Moderators */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Moderators
            </label>
            <Search value={{ setModerator, moderator }} />
          </div>

          {/* Submit Button */}
          <button
            onClick={() => submitHandler()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}
