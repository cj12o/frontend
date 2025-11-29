import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { useNavigate, Link } from "react-router-dom";
import { Button, Logo, LogoutBtn } from "../index.js";
import { useSelector } from "react-redux";
import { useState, useRef } from "react";
import { Bell } from "lucide-react";
import NotificationList from "@/pages/Notification.js";
import { getNotificationCount } from "@/backend/notification.ts";
import { ChevronRight } from "lucide-react";

function Header() {
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Redux Selectors (Typed safely)
  const authStatus = useSelector((state: any) => state.authStatus);
  const name = useSelector((state: any) => state.name) || "guest";
  const profile_pic = useSelector((state: any) => state.profile_pic);

  // WebSocket Configuration
  const socketUrl = `ws://127.0.0.1:8000/ws/notify/?token=${
    localStorage.getItem("cookie") || ""
  }`;
  const { lastJsonMessage } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
    onError: () => {}, // Suppress errors for demo
  });

  // Effect: Initial Count Fetch
  useEffect(() => {
    getNotificationCount()
      .then((data) => {
        setNotificationCount(data);
      })
      .catch((err) => console.error("Failed to fetch count", err));
  }, []);

  useEffect(() => {
    if (!lastJsonMessage) return;
    setNotificationCount((prev) => prev + 1);

    // Show toast notification
    const message =
      (lastJsonMessage as any).message || "You have a new notification";
    setToastMsg(message);

    // Clear toast after 3 seconds
    const timer = setTimeout(() => {
      setToastMsg(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [lastJsonMessage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropDownStatus(false);
      }
    };

    if (dropDownStatus) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDownStatus]);

  const navigate = useNavigate();

  const navItems = [
    { name: "login", topath: "/login", isactive: !authStatus },
    { name: "signup", topath: "/signup", isactive: !authStatus },
    { name: "profile", topath: `/profile/${name}`, isactive: authStatus },
    { name: "moderation", topath: "/moderator", isactive: authStatus },
  ];

  return (
    <>
      {/* Sticky Header with blur effect */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <div onClick={() => navigate("/")} className="flex-shrink-0">
              <Logo />
            </div>

            {/* Welcome Message (Hidden on small screens) */}
            <div className="hidden md:block text-sm font-medium text-gray-600">
              Welcome back,{" "}
              <span className="text-gray-900 font-semibold">{name}</span>
            </div>

            {/* Actions Section */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Dynamic Navigation Items */}
              {navItems
                .filter((item) => item.isactive)
                .map((item) => {
                  if (item.name === "profile") {
                    return (
                      <button
                        key={item.name}
                        className="group relative h-10 w-10 overflow-hidden rounded-full border-2 border-gray-200 transition-all hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        onClick={() => navigate(item.topath)}
                      >
                        {profile_pic ? (
                          <img
                            src={profile_pic}
                            alt="Profile"
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-bold text-gray-600">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </button>
                    );
                  }
                  return (
                    <div key={item.name} className="hidden sm:block">
                      <Button
                        onClick={() => navigate(item.topath)}
                        value={item.name}
                        type="button"
                      />
                    </div>
                  );
                })}

              {/* Notification Bell */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropDownStatus(!dropDownStatus)}
                  className={`relative rounded-full p-2 transition-all duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    dropDownStatus
                      ? "bg-gray-100 text-blue-600"
                      : "text-gray-500"
                  }`}
                  aria-label="Notifications"
                >
                  {authStatus && <Bell size={22} />}

                  {authStatus && notificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {dropDownStatus && (
                  <div className="absolute right-0 mt-3 w-80 md:w-96 origin-top-right transform rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all animate-fadeIn overflow-hidden">
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Notifications
                      </h3>
                      <button
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        onClick={() => setNotificationCount(0)}
                      >
                        Mark all read
                      </button>
                    </div>

                    {/* Dropdown Content - SCROLLABLE AREA */}
                    {/* max-h-[calc(100vh-12rem)] ensures it doesn't cover the screen regardless of viewport height */}
                    <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
                      <NotificationList />
                    </div>

                    {/* Dropdown Footer */}
                    <div className="border-t border-gray-100 bg-gray-50 p-2">
                      <Link
                        to="/notifications"
                        onClick={() => setDropDownStatus(false)}
                        className="flex w-full items-center justify-center rounded-lg py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        View All Activity{" "}
                        <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Logout */}
              <div
                className="cursor-pointer"
                onClick={() => {
                  setNotificationCount(0);
                  setDropDownStatus(false);
                }}
              >
                {authStatus && <LogoutBtn />}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-5 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
          <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-4 flex items-start gap-3 max-w-sm">
            <div className="bg-indigo-50 p-2 rounded-full shrink-0">
              <Bell className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                New Notification
              </h4>
              <p className="text-sm text-gray-600 mt-0.5">{toastMsg}</p>
            </div>
            <button
              onClick={() => setToastMsg(null)}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
