import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoomsList } from "@/backend/moderator";
import { useSelector } from "react-redux";

const Moderator = () => {
  type Rooms = {
    id: number;
    name: string;
  };
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [error, setError] = useState("");
  const authstatus = useSelector((state: any) => state.authStatus);
  const navigate = useNavigate();

  useEffect(() => {
    getRoomsList()
      .then((data) => setRooms(() => [...data]))
      .catch((e) => setError(e.message));
  }, []);

  if (!authstatus) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Moderation Dashboard
          </h1>
          <p className="mt-2 text-gray-500">
            Select a room to review and moderate messages.
          </p>
        </header>

        {error.length > 0 && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {rooms && rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Review flagged messages in this room.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/moderator/rooms/${room.id}`)}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Moderate
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No messages to moderate
              </h2>
              <p className="text-gray-500 max-w-md">
                Good job! You're all caught up. There are no active rooms
                requiring moderation at the moment.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Moderator;
