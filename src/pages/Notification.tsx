import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { getNotification } from "../backend/notification"; // Fixed import path
import { listJoinRequests, manageJoinRequest } from "../backend/join_request";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  Clock,
  UserPlus,
  Check,
  X,
} from "lucide-react";

const NotificationList: React.FC = () => {
  type NotificationItem = {
    id: number;
    notify: string;
    read: boolean;
    timestamp?: string; // Optional for now, but good for UI
    type?: "info" | "success" | "warning" | "error";
  };
  // State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"notifications" | "requests">(
    "notifications"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // WebSocket Configuration
  // Note: In a real app, manage this token securely.
  const socketUrl = `ws://127.0.0.1:8000/ws/notify/?token=${
    localStorage.getItem("cookie") || ""
  }`;

  const { lastJsonMessage } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 3,
    reconnectInterval: 3000,
    onError: () => {
      // Silently handle error for UI demo purposes, or set generic error
      console.log("WS connection error - Make sure backend is running");
    },
  });

  // Handle incoming WS messages
  useEffect(() => {
    if (!lastJsonMessage) return;

    // Type guard or casting for the message
    const message = lastJsonMessage as any;

    if (message && message.id && message.notify) {
      setNotifications((prev) => {
        // Prevent duplicates if ID exists
        if (prev.some((n) => n.id === message.id)) return prev;

        const newNote: NotificationItem = {
          id: message.id,
          notify: message.notify,
          read: false,
          type: "info", // Default type
          timestamp: "Just now",
        };
        return [newNote, ...prev];
      });
    }
  }, [lastJsonMessage]);

  // Initial Fetch
  useEffect(() => {
    setIsLoading(true);
    getNotification()
      .then((data) => {
        setNotifications((prev) => {
          // Merge strategies can vary. Here we deduplicate by ID.
          const existingIds = new Set(prev.map((n) => n.id));
          const uniqueNew = data.filter((d: any) => !existingIds.has(d.id));
          return [...prev, ...uniqueNew];
        });
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError("Failed to load notifications");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeTab === "requests") {
      setIsLoading(true);
      listJoinRequests()
        .then((data) => {
          setJoinRequests(data);
          setIsLoading(false);
        })
        .catch((e) => {
          console.error(e);
          // setError("Failed to load requests");
          setIsLoading(false);
        });
    }
  }, [activeTab]);

  const handleManageRequest = async (
    id: number,
    action: "ACCEPT" | "REJECT"
  ) => {
    try {
      await manageJoinRequest(id, action);
      setJoinRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to process request");
    }
  };

  // Helper to get icon based on type
  const getIcon = (type?: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="text-green-500" size={18} />;
      case "warning":
        return <AlertCircle className="text-orange-500" size={18} />;
      case "error":
        return <XCircle className="text-red-500" size={18} />;
      default:
        return <Info className="text-blue-500" size={18} />;
    }
  };

  if (
    isLoading &&
    notifications.length === 0 &&
    activeTab === "notifications"
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-3">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex border-b border-gray-100 mb-4">
        <button
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "notifications"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
          {activeTab === "notifications" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
          )}
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "requests"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("requests")}
        >
          Join Requests
          {activeTab === "requests" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
          )}
        </button>
      </div>

      {activeTab === "notifications" ? (
        notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-50 p-4 rounded-full mb-3">
              <Bell className="text-gray-300" size={24} />
            </div>
            <p className="text-gray-900 font-medium text-sm">
              No notifications yet
            </p>
            <p className="text-gray-500 text-xs mt-1">
              We'll let you know when something arrives.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((note) => (
              <div
                key={note.id}
                className={`
                                    p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group flex gap-3 items-start
                                    ${!note.read ? "bg-blue-50/40" : "bg-white"}
                                `}
              >
                <div className="mt-0.5 flex-shrink-0">{getIcon(note.type)}</div>
                <div className="flex-1 space-y-1">
                  <p
                    className={`text-sm leading-snug ${
                      !note.read ? "text-gray-900 font-medium" : "text-gray-600"
                    }`}
                  >
                    {note.notify}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {note.timestamp && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {note.timestamp}
                      </span>
                    )}
                  </div>
                </div>
                {!note.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        )
      ) : // Join Requests Tab
      joinRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-50 p-4 rounded-full mb-3">
            <UserPlus className="text-gray-300" size={24} />
          </div>
          <p className="text-gray-900 font-medium text-sm">
            No pending requests
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Requests to join your private rooms will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {joinRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 hover:bg-gray-50 transition-colors duration-200 flex gap-3 items-start"
            >
              <div className="mt-1 flex-shrink-0">
                {req.user_profile_pic ? (
                  <img
                    src={req.user_profile_pic}
                    alt={req.user_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {req.user_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{req.user_name}</span> wants
                  to join <span className="font-semibold">{req.room_name}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Requested {new Date(req.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleManageRequest(req.id, "ACCEPT")}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition"
                  >
                    <Check size={14} /> Accept
                  </button>
                  <button
                    onClick={() => handleManageRequest(req.id, "REJECT")}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 transition"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
