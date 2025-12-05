import React, { useEffect, useState, useContext } from "react";
import { getPolls, getVoteData } from "../backend/polls.ts";
import { Link } from "react-router-dom";

import { WebSocketContext } from "../pages/WebSocketProvider";

type VoteData = Record<string, number | boolean> & {
  user_has_vote: boolean;
  user_vote: number;
};

const Poll = ({ id, room_id }: { id: number; room_id: number }) => {
  const {} = useContext(WebSocketContext);

  type Author = {
    username: string;
    profile_pic?: string;
  };

  type Poll = {
    id: number;
    author: Author | string;
    question: string;
    choices: string[];
    room: number;
  };

  const [poll, setPolls] = useState<Poll | null>(null);
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);

  const getpollsData = async (id: number) => {
    const data = await getPolls(id);
    console.log(`POLL data:${data.question}`);
    setPolls(data);
  };

  const fetchVoteData = async (room_id: number, poll_id: number) => {
    const data = await getVoteData(room_id);
    if (data && data[poll_id]) {
      setVoteData(data[poll_id]);

      // Calculate total votes
      const total = Object.keys(data[poll_id])
        .filter((key) => !isNaN(Number(key)))
        .reduce((sum, key) => sum + data[poll_id][key], 0);
      setTotalVotes(total);
    }
  };

  useEffect(() => {
    getpollsData(id);
  }, [id]);

  useEffect(() => {
    if (poll && room_id) {
      fetchVoteData(room_id, poll.id);
    }
  }, [poll, room_id]);

  // Helper to get author username
  const getAuthorUsername = () => {
    if (!poll) return "";
    return typeof poll.author === "string" ? poll.author : poll.author.username;
  };

  // Helper to get author profile pic
  const getAuthorProfilePic = () => {
    if (!poll || typeof poll.author === "string") return null;
    return poll.author.profile_pic;
  };

  // Calculate percentage for a choice
  const getPercentage = (choiceIndex: number): number => {
    if (!voteData || totalVotes === 0) return 0;
    const votes = voteData[choiceIndex.toString()];
    const voteCount = typeof votes === "number" ? votes : 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  // Get vote count for a choice
  const getVoteCount = (choiceIndex: number): number => {
    if (!voteData) return 0;
    const votes = voteData[choiceIndex.toString()];
    return typeof votes === "number" ? votes : 0;
  };

  // Check if this choice is the user's vote
  const isUserChoice = (choiceIndex: number): boolean => {
    if (!voteData) return false;
    return voteData.user_has_vote && voteData.user_vote === choiceIndex;
  };

  return (
    <>
      {poll ? (
        <div className="bg-white rounded-lg shadow-sm p-3 w-full border border-gray-100">
          {/* Author Section with Profile Picture */}
          <Link
            to={`/profile/${getAuthorUsername()}`}
            className="flex items-center gap-2 mb-3 group"
          >
            {/* Profile Picture */}
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-indigo-100 group-hover:border-indigo-300 transition-all shadow-sm">
              {getAuthorProfilePic() ? (
                <img
                  src={getAuthorProfilePic()!}
                  alt={getAuthorUsername()}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initial avatar if image fails
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.classList.add(
                        "bg-gradient-to-br",
                        "from-indigo-400",
                        "to-purple-500"
                      );
                      parent.innerHTML = `<span class="text-white text-[9px] font-bold flex items-center justify-center w-full h-full">${getAuthorUsername()
                        .charAt(0)
                        .toUpperCase()}</span>`;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">
                    {getAuthorUsername().charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Username */}
            <div className="flex flex-col">
              <span className="text-[9px] text-gray-500 font-medium">
                Poll by
              </span>
              <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors">
                @{getAuthorUsername()}
              </span>
            </div>
          </Link>

          {/* Poll Question */}
          <h2 className="text-sm font-bold text-gray-800 mb-2">
            {poll.question}
          </h2>

          {/* Total Votes Display */}
          {voteData && (
            <div className="text-[10px] text-gray-500 mb-2">
              {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
              {voteData.user_has_vote && (
                <span className="ml-2 text-indigo-600 font-medium">
                  • You voted
                </span>
              )}
            </div>
          )}

          {/* Poll Choices */}
          <div className="space-y-1.5">
            {poll.choices
              ? poll.choices.map((choice, index) => {
                  const percentage = getPercentage(index);
                  const voteCount = getVoteCount(index);
                  const isSelected = isUserChoice(index);

                  return (
                    <div
                      key={index}
                      className={`relative overflow-hidden rounded border transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 shadow-sm"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                      }`}
                    >
                      {/* Progress Bar Background */}
                      {voteData && (
                        <div
                          className={`absolute inset-0 transition-all duration-500 ${
                            isSelected ? "bg-indigo-200" : "bg-gray-100"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      )}

                      {/* Choice Content */}
                      <label className="relative flex items-center justify-between p-2 cursor-pointer">
                        <div className="flex items-center flex-1">
                          <input
                            type="radio"
                            name={`poll-${poll.id}`}
                            checked={isSelected}
                            className={`w-3 h-3 focus:ring-indigo-500 ${
                              isSelected ? "text-indigo-600" : "text-gray-400"
                            }`}
                            readOnly
                          />
                          <span
                            className={`ml-2 text-xs font-medium ${
                              isSelected ? "text-indigo-900" : "text-gray-700"
                            }`}
                          >
                            {choice}
                          </span>
                        </div>

                        {/* Vote Count and Percentage */}
                        {voteData && (
                          <div
                            className={`flex items-center gap-2 text-[10px] font-semibold ${
                              isSelected ? "text-indigo-700" : "text-gray-600"
                            }`}
                          >
                            <span>
                              {voteCount} {voteCount === 1 ? "vote" : "votes"}
                            </span>
                            <span className="text-xs">{percentage}%</span>
                          </div>
                        )}
                      </label>
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default React.memo(Poll);
