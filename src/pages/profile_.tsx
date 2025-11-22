import { useEffect, useState } from "react";
import {
  Camera,
  Mail,
  Hash,
  CircleDot,
  Clock,
  Users,
  Calendar,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { getProfile } from "@/backend/profile.ts";
import { useParams, Link } from "react-router-dom";

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
  const params = useParams<{ name: string }>();

  const formatDate = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const getProfileData = async (name: string) => {
    try {
      const resp = await getProfile(name);
      setData(resp);
    } catch (e) {
      console.error("Profile fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.name) getProfileData(params.name);
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="animate-pulse text-xl font-semibold text-indigo-500">
          Loading profile...
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        User not found.
      </div>
    );

  const user = data.userdata[0];
  const stats = [
    {
      label: "Created Rooms",
      value: data.rooms_created.length,
      icon: Sparkles,
      accent: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Member Of",
      value: data.rooms_member.length,
      icon: Users,
      accent: "text-green-600 bg-green-50",
    },
  ];

  return (
    // <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-100 via-purple-50 to-white py-8 px-4">
    //   {/* Profile Header Card */}
    //   <div className="relative w-full max-w-5xl bg-white/80 backdrop-blur rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-transparent hover:border-indigo-300">
    //     <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl relative overflow-hidden">
    //       <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_55%)]" />
    //       <div className="absolute left-8 bottom-[-4rem]">
    //         <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
    //           {user.profile_pic ? (
    //             <img
    //               src={user.profile_pic}
    //               alt="Profile"
    //               className="w-full h-full object-cover"
    //             />
    //           ) : (
    //             <div className="h-full w-full flex items-center justify-center text-4xl font-semibold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
    //               {data.name.charAt(0).toUpperCase()}
    //             </div>
    //           )}
    //           <span
    //             className={`absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white shadow ${
    //               user.is_online ? "bg-green-500" : "bg-gray-400"
    //             }`}
    //           />
    //         </div>
    //       </div>
    //     </div>

    //     {/* Basic Info */}
    //     <div className="pt-20 px-8 pb-6 flex flex-col gap-6">
    //       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
    //         <div>
    //           <div className="flex items-center gap-3">
    //             <h1 className="text-3xl font-semibold text-gray-800">
    //               {data.name}
    //             </h1>
    //             <span
    //               className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${
    //                 user.is_online
    //                   ? "bg-green-100 text-green-700"
    //                   : "bg-gray-100 text-gray-600"
    //               }`}
    //             >
    //               <CircleDot size={12} />
    //               {user.is_online ? "Online" : "Offline"}
    //             </span>
    //           </div>
    //           <div className="flex flex-wrap items-center gap-4 text-gray-500 mt-3 text-sm">
    //             <span className="flex items-center gap-1">
    //               <Hash size={14} /> ID: {user.id}
    //             </span>
    //             <span className="flex items-center gap-1">
    //               <Mail size={14} /> {data.email}
    //             </span>
    //             <span className="flex items-center gap-1">
    //               <Clock size={14} /> Last seen: {formatDate(user.last_seen)}
    //             </span>
    //           </div>
    //         </div>
    //         <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
    //           <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl shadow-inner border border-indigo-100">
    //             Joined {formatDate(user.created_at)}
    //           </div>
    //         </div>
    //       </div>
    //       <div className="grid sm:grid-cols-3 gap-4">
    //         {stats.map((item) => (
    //           <div
    //             key={item.label}
    //             className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition"
    //           >
    //             <div
    //               className={`h-11 w-11 flex items-center justify-center rounded-lg ${item.accent}`}
    //             >
    //               <item.icon size={18} />
    //             </div>
    //             <div>
    //               <p className="text-xs uppercase tracking-wider text-gray-400">
    //                 {item.label}
    //               </p>
    //               <p className="text-lg font-semibold text-gray-800">
    //                 {item.value}
    //               </p>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>

    //   {/* Bio Section */}
    //   <div className="w-full max-w-5xl mt-6 bg-white rounded-2xl shadow-md p-6 border border-transparent hover:border-indigo-200 transition-all">
    //     <div className="flex items-center gap-2 mb-3 text-indigo-600">
    //       <Camera size={18} />
    //       <h2 className="text-lg font-semibold text-gray-800">Bio</h2>
    //     </div>
    //     <p className="text-gray-600 leading-relaxed">
    //       {user.bio || "This user hasn’t added a bio yet."}
    //     </p>
    //   </div>

    //   {/* Rooms Info */}
    //   <div className="w-full max-w-5xl mt-6 bg-white rounded-2xl shadow-md p-6 border border-transparent hover:border-indigo-200 transition-all">
    //     <div className="flex items-center gap-2 text-indigo-600 mb-4">
    //       <MessageSquare size={18} />
    //       <h2 className="text-lg font-semibold text-gray-800">Rooms</h2>
    //     </div>

    //     <div className="grid sm:grid-cols-2 gap-4">
    //       <div>
    //         <h3 className="text-md font-semibold text-indigo-700 mb-2 flex items-center gap-2">
    //           <Sparkles size={16} /> Created Rooms
    //         </h3>
    //         <div className="flex flex-wrap gap-2">
    //           {data.rooms_created.length > 0 ? (
    //             data.rooms_created.map((room) => (
    //               <Link
    //                 key={room.id}
    //                 to={`/rooms/${room.id}/messages`}
    //                 className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-indigo-200 transition"
    //               >
    //                 {room.name}
    //               </Link>
    //             ))
    //           ) : (
    //             <p className="text-gray-400 text-sm">
    //               No created rooms just yet.
    //             </p>
    //           )}
    //         </div>
    //       </div>

    //       <div>
    //         <h3 className="text-md font-semibold text-green-700 mb-2 flex items-center gap-2">
    //           <Users size={16} /> Member Of
    //         </h3>
    //         <div className="flex flex-wrap gap-2">
    //           {data.rooms_member.length > 0 ? (
    //             data.rooms_member.map((room) => (
    //               <Link
    //                 key={room.id}
    //                 to={`/rooms/${room.id}/messages`}
    //                 className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition"
    //               >
    //                 {room.name}
    //               </Link>
    //             ))
    //           ) : (
    //             <p className="text-gray-400 text-sm">No memberships</p>
    //           )}
    //         </div>
    //       </div>
    //     </div>

    //     {/* Activity */}
    //     <div className="mt-8 bg-gray-50 border border-gray-100 rounded-xl p-4 grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
    //       <div className="flex items-start gap-3">
    //         <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
    //           <Clock size={16} />
    //         </div>
    //         <div>
    //           <p className="font-semibold text-gray-800">Last Seen</p>
    //           <p>{formatDate(user.last_seen)}</p>
    //         </div>
    //       </div>
    //       <div className="flex items-start gap-3">
    //         <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
    //           <Calendar size={16} />
    //         </div>
    //         <div>
    //           <p className="font-semibold text-gray-800">Account Created</p>
    //           <p>{formatDate(user.created_at)}</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <></>
  );
}
