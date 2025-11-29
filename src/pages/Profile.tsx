import { useEffect, useState, useRef } from "react";
import {
  Camera,
  Mail,
  Hash,
  Clock,
  Trash2,
  Settings,
  Send,
  Edit2,
  X,
  Check,
  User,
  Shield,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { getProfile, updateProfile } from "@/backend/profile.ts";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function UserProfile() {
  type UserData = {
    id: number;
    bio: string;
    last_seen: string;
    is_online: boolean;
    profile_pic: any;
    roles: string;
    created_at: string;
    user: number;
  };

  type RoomDetails = {
    name: string;
    id: number;
  };

  type ProfileData = {
    userdata: UserData[];
    name: string;
    rooms_member: RoomDetails[];
    email: string;
    rooms_created: RoomDetails[];
  };

  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // IMAGE
  const [toBeupdateImageurl, setToUpdateImageUrl] = useState<File | null>(null);
  const [deleteImg, setDeleteImg] = useState<boolean>(false);

  // GENERAL UI STATE
  const [errors, setErrors] = useState<string[]>([]);
  const [displayActionBtn, setDisplayActionBtn] = useState(false);

  // FIELDS
  const [updatedBio, setUpdatedBio] = useState("");
  const [editBio, setEditbio] = useState(false);

  const [updatedEmail, setUpdatedEmail] = useState("");
  const [editEmail, setEditEmail] = useState(false);

  const [updatedUsername, setUpdatedUsername] = useState("");
  const [editUsername, setEditUsername] = useState(false);

  const params = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch profile
  const getProfileData = async (name: string) => {
    try {
      const resp: ProfileData = await getProfile(name);
      setData(resp);

      setUpdatedBio(resp.userdata[0].bio);
      setUpdatedEmail(resp.email);
      setUpdatedUsername(resp.name);
    } catch (e) {
      console.log("Profile error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Send updates
  const upload = async () => {
    try {
      const oldUsername = data?.name;

      await updateProfile(
        toBeupdateImageurl,
        deleteImg,
        updatedBio,
        updatedEmail,
        updatedUsername,
        dispatch
      );

      setToUpdateImageUrl(null);
      setEditbio(false);
      setEditEmail(false);
      setEditUsername(false);
      setDeleteImg(false);

      if (updatedUsername !== oldUsername) {
        navigate(`/profile/${updatedUsername}`);
        return;
      }

      if (params.name) getProfileData(params.name);
    } catch (e: any) {
      setErrors((prev) => [...prev, e.message]);
    }
  };

  useEffect(() => {
    if (params.name) getProfileData(params.name);
  }, [params.name]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 bg-indigo-200 rounded-full"></div>
          <div className="text-xl font-semibold text-indigo-500">
            Loading profile...
          </div>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500">
        <div className="text-center">
          <User size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg">User not found.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-indigo-600 hover:underline"
          >
            Go Home
          </button>
        </div>
      </div>
    );

  const user = data.userdata[0];
  const username_localstorage = localStorage.getItem("name") || "";
  const isOwnProfile = username_localstorage === data.name;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col md:flex-row overflow-hidden">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out forwards;
          }
          .animate-slide-in {
            animation: slideInRight 0.6s ease-out forwards;
            animation-delay: 0.2s;
            opacity: 0;
          }
        `}
      </style>

      {/* LEFT SIDE - PROFILE CARD */}
      <div className="w-full md:w-5/12 lg:w-4/12 p-6 flex flex-col gap-6 overflow-y-auto animate-fade-in border-r border-gray-200 bg-white z-10 shadow-xl">
        {/* Error Display */}
        {errors.length > 0 && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div>
              {errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
            <button
              onClick={() => setErrors([])}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Card Container */}
        <div className="relative w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all duration-300">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Pic & Actions */}
          <div className="px-6 relative">
            <div className="absolute -top-16 left-6">
              <div className="relative h-32 w-32 rounded-full border-[6px] border-white shadow-lg bg-white group-hover:scale-105 transition-transform duration-300">
                <div className="h-full w-full rounded-full overflow-hidden relative">
                  {user.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600 text-4xl font-bold">
                      {data.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Online Status Indicator */}
                  {!isOwnProfile && (
                    <div
                      className={`absolute bottom-0 right-0 w-full h-full border-[6px] border-transparent rounded-full pointer-events-none ${
                        user.is_online
                          ? "border-b-green-500"
                          : "border-b-gray-400"
                      } opacity-50`}
                    ></div>
                  )}
                </div>

                {/* Settings Button */}
                {isOwnProfile && (
                  <button
                    onClick={() => setDisplayActionBtn((p) => !p)}
                    className="absolute bottom-1 right-1 bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <Settings size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons (Upload/Delete) */}
            <div className="flex justify-end pt-4 min-h-[60px]">
              {displayActionBtn && (
                <div className="flex gap-2 animate-fade-in bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner">
                  {/* Upload */}
                  {!toBeupdateImageurl && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
                      title="Upload Photo"
                    >
                      <Camera size={18} />
                    </button>
                  )}

                  {/* Delete */}
                  {user.profile_pic && (
                    <button
                      onClick={() => {
                        setDeleteImg(true);
                        setTimeout(upload, 0);
                      }}
                      className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                      title="Remove Photo"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                  {/* Confirm Upload */}
                  {toBeupdateImageurl && (
                    <button
                      onClick={upload}
                      className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors"
                      title="Save Photo"
                    >
                      <Send size={18} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="pt-4 px-6 pb-8">
            {/* Username */}
            <div className="mb-1">
              {editUsername ? (
                <div className="flex items-center gap-2">
                  <input
                    value={updatedUsername}
                    onChange={(e) => setUpdatedUsername(e.target.value)}
                    className="border-b-2 border-indigo-500 px-1 py-1 text-2xl font-bold text-gray-800 focus:outline-none bg-transparent w-full"
                    autoFocus
                  />
                  <button
                    onClick={upload}
                    className="text-green-600 hover:bg-green-50 p-1 rounded"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setEditUsername(false);
                      setUpdatedUsername(data.name);
                    }}
                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group/name">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {data.name}
                  </h1>
                  {isOwnProfile && (
                    <button
                      onClick={() => setEditUsername(true)}
                      className="opacity-0 group-hover/name:opacity-100 text-gray-400 hover:text-indigo-600 transition-opacity"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ID & Roles */}
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                <Hash size={14} /> {user.id}
              </span>
              {user.roles && (
                <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">
                  <Shield size={14} /> {user.roles}
                </span>
              )}
            </div>

            {/* Details Grid */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3 text-gray-600 group/email">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <Mail size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                    Email
                  </p>
                  {editEmail ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={updatedEmail}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                        className="border-b border-indigo-300 w-full py-0.5 text-sm focus:outline-none"
                      />
                      <button onClick={upload} className="text-green-600">
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setEditEmail(false);
                          setUpdatedEmail(data.email);
                        }}
                        className="text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{updatedEmail}</p>
                      {isOwnProfile && (
                        <button
                          onClick={() => setEditEmail(true)}
                          className="opacity-0 group-hover/email:opacity-100 text-gray-400 hover:text-indigo-600"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Last Seen */}
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                    Last Seen
                  </p>
                  <p className="text-sm font-medium">{user.last_seen}</p>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                    Member Since
                  </p>
                  <p className="text-sm font-medium">{user.created_at}</p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-8 pt-6 border-t border-gray-100 group/bio">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  About
                </h3>
                {isOwnProfile && !editBio && (
                  <button
                    onClick={() => setEditbio(true)}
                    className="opacity-0 group-hover/bio:opacity-100 text-xs text-indigo-600 font-medium hover:underline"
                  >
                    Edit Bio
                  </button>
                )}
              </div>

              {editBio ? (
                <div className="space-y-2">
                  <textarea
                    value={updatedBio}
                    onChange={(e) => setUpdatedBio(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditbio(false)}
                      className="px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={upload}
                      className="px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Save Bio
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  {updatedBio || "No bio added yet."}
                </p>
              )}
            </div>
          </div>
        </div>

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) setToUpdateImageUrl(e.target.files[0]);
          }}
        />
      </div>

      {/* RIGHT SIDE - ROOMS */}
      <div className="flex-1 bg-gray-50 p-6 md:p-10 overflow-y-auto animate-slide-in">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Created Rooms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                <MessageSquare size={16} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Created Rooms</h2>
              <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {data.rooms_created.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {data.rooms_created.length > 0 ? (
                data.rooms_created.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all group"
                  >
                    <h3 className="font-medium text-gray-800 text-sm truncate mb-0.5">
                      {room.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 mb-2">
                      ID: {room.id}
                    </p>
                    <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/rooms/${room.id}/messages`)}
                        className="flex-1 bg-indigo-50 text-indigo-600 py-1 rounded text-[10px] font-medium hover:bg-indigo-100 transition-colors"
                      >
                        Visit
                      </button>
                      <button
                        onClick={() => navigate(`/rooms/${room.id}/edit`)}
                        className="px-2 bg-gray-50 text-gray-600 py-1 rounded text-[10px] font-medium hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-6 text-center bg-white rounded-lg border border-dashed border-gray-300 text-gray-400 text-xs">
                  <p>No rooms created yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Member Rooms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                <User size={16} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Joined Rooms</h2>
              <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {data.rooms_member.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {data.rooms_member.length > 0 ? (
                data.rooms_member.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all group"
                  >
                    <h3 className="font-medium text-gray-800 text-sm truncate mb-0.5">
                      {room.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 mb-2">
                      ID: {room.id}
                    </p>
                    <button
                      onClick={() => navigate(`/rooms/${room.id}/messages`)}
                      className="w-full bg-green-50 text-green-600 py-1 rounded text-[10px] font-medium hover:bg-green-100 transition-colors opacity-60 group-hover:opacity-100"
                    >
                      Visit Room
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-6 text-center bg-white rounded-lg border border-dashed border-gray-300 text-gray-400 text-xs">
                  <p>Not a member of any rooms.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
