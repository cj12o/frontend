// import React, { useEffect, useState } from 'react';
// import { Camera, Mail, Hash } from 'lucide-react';

// import { getProfile } from '@/backend/profile.ts';
// import { useParams } from 'react-router-dom';
// import { Link } from 'react-router-dom';




// export default function UserProfile() {



//   type userdata={
//     id:number,
//     bio: string,
//     last_seen:string,
//     is_online: boolean,
//     profile_pic: any,
//     roles:string,
//     created_at:string,
//     user:number
//   }
//   type room_det={
//     name:string,
//     id:number
//   }
//   type userData={
//     userdata:userdata [],
//     name:string,
//     rooms_member:room_det [],
//     email: string,
//     rooms_created:room_det [],
//   }


//   const [data,setData]=useState<userData|null>(null)

//   const getProfileData=async (name:string)=>{
//     try{
//       const resp=await getProfile(name)
//       console.log(resp)
//       setData(resp)
      
//     }catch(e){

//     }
//   }
//   const params = useParams<{name:string}>();
//   useEffect(() => {
//     if(!params.name) return
//     getProfileData(params?.name);
//   }, []);
//   return (
//     <div className="relative grid justify-center h-screen items-center bg-blue-200">
//       {/* Top Profile Card */}
//       <div className="bg-indigo-300 w-[70vw] h-[40vh] mt-3 text-white rounded-xl shadow-xl hover:shadow-xl shadow-black-600 hover:border-2 border-indigo-600">
//         {/* Cover background */}
//         <div className="h-2/3 overflow-hidden rounded-t-xl bg-gradient-to-r from-blue-500 to-purple-600 ">
//           {/* Profile Photo */}
          
//           <div>
//             {
//               data?.userdata[0].profile_pic?(
//                 <div className="bg-blue-900 relative h-[20vh] w-[20vh] ml-6 mt-6 rounded-full border-2 border-white flex justify-center items-center text-4xl ">
//                   <img src={data?.userdata[0].profile_pic} alt=""  className='w-full h-full rounded-full'/>
//                 </div>
//               ):(
//                  <div className="bg-blue-900 relative h-[20vh] w-[20vh] ml-6 mt-6 rounded-full border-2 border-white flex justify-center items-center text-4xl ">
//                   {data?.name.charAt(0).toUpperCase()}
//                 </div>
//               )
//             }
          
//             <div className="absolute right-[2px] bottom-[2px] bg-green-500 h-[1vh] w-[1vh] rounded-full border border-white"></div>
            
//           </div>
//         </div>

//         {/* Name, ID, Mail (left) and Last seen (right) */}
//         <div className="flex justify-between items-center px-6 mt-2">
//           {/* Left side */}
//           <div className="flex flex-col">
//             {
//               data && <div className="flex items-center gap-2 text-2xl font-semibold">{data.name}</div>
//             }
            
//             <div className="flex items-center gap-3 mt-1 text-sm text-gray-100">
//               <Hash size={16} />
//               <span>ID:{data && data.userdata[0].id}</span>
//               <Mail size={16} />
//               <span>{data?.email}</span>
//             </div>
//           </div>

//           {/* Right side — Last seen */}
//           <div className="text-md text-right text-gray-100">
//             <div>Last seen:</div>
//             {data && <div>{data.userdata[0].last_seen}</div>}10hrs ago
//           </div>
//         </div>
//       </div>

//       {/* Bio Section */}
//       <div className="bg-white relative shadow-xl font-semibold w-[70vw] h-[20vh] mt-3 text-black p-4 rounded-xl hover:shadow-xl shadow-black-600 hover:border-2 border-indigo-600">
//         <h2 className="text-lg font-semibold mb-2">Bio</h2>
//         <p className="text-sm leading-relaxed">
//           {data &&  data.userdata[0].bio}
//         </p>
//       </div>

//       {/* Rooms/Other Info */}
//       <div className="grid p-3 bg-white shadow-xl w-[70vw] h-[30vh] mt-3 rounded-xl hover:shadow-xl shadow-black-600 hover:border-2 border-indigo-600">
//         <div className="flex">
//           <div className="text-lg font-semibold mb-2">created_at:</div>
//           <div className="mt-1 ml-2">{data && data.userdata[0].created_at}</div>
//         </div>
//         <div className="flex">
//           <div className="text-lg font-semibold mb-2">Roles:</div>
//           <div className="mt-1 ml-2">{data && data.userdata[0].roles}</div>
//         </div>
//         <div className="flex">
//           <div className="text-lg font-semibold mb-2">Author:</div>
//           <div className="mt-1 ml-2 flex">
//             {data && (data.rooms_created).map((room)=>{
//               return <Link to={`/rooms/${room.id}/messages`} className='bg-red-300 p-1 rounded-xl m-1 hover:shadow-xl hover:text-blue-500 1'>{` ${room.name} ` }</Link>
//             })}
//           </div>
//         </div>
//         <div className="flex">
//           <div className="text-lg font-semibold mb-2">Member:</div>
//           <div className="mt-1 ml-2">{
//             data?.rooms_member.map((room)=>{
//                 return <Link to={`/rooms/${room.id}/messages`} className='bg-green-300 p-1 rounded-xl m-1 hover:shadow-xl hover:text-blue-500'>{` ${room.name} `}</Link>
//             })
//             }</div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Camera, Mail, Hash, CircleDot, Clock } from "lucide-react";
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

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-100 via-purple-50 to-white py-8 px-4">
      {/* Profile Header Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-transparent hover:border-indigo-300">
        <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl relative">
          <div className="absolute left-8 bottom-[-4rem]">
            <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
              {user.profile_pic ? (
                <img
                  src={user.profile_pic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-4xl font-bold bg-indigo-600 text-white">
                  {data.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span
                className={`absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white ${
                  user.is_online ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="pt-20 px-8 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
              {data.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-gray-500 mt-2 text-sm">
              <span className="flex items-center gap-1">
                <Hash size={14} /> ID: {user.id}
              </span>
              <span className="flex items-center gap-1">
                <Mail size={14} /> {data.email}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> Last seen: {user.last_seen}
              </span>
            </div>
          </div>
          <div className="text-gray-600 text-sm font-medium">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
              Role: {user.roles}
            </span>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="w-full max-w-5xl mt-6 bg-white rounded-2xl shadow-md p-6 border border-transparent hover:border-indigo-200 transition-all">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Bio</h2>
        <p className="text-gray-600 leading-relaxed">
          {user.bio || "This user hasn’t added a bio yet."}
        </p>
      </div>

      {/* Rooms Info */}
      <div className="w-full max-w-5xl mt-6 bg-white rounded-2xl shadow-md p-6 border border-transparent hover:border-indigo-200 transition-all">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Rooms</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-md font-semibold text-indigo-700 mb-2">
              Created Rooms
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.rooms_created.length > 0 ? (
                data.rooms_created.map((room) => (
                  <Link
                    key={room.id}
                    to={`/rooms/${room.id}/messages`}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-indigo-200 transition"
                  >
                    {room.name}
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No created rooms</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-green-700 mb-2">
              Member Of
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.rooms_member.length > 0 ? (
                data.rooms_member.map((room) => (
                  <Link
                    key={room.id}
                    to={`/rooms/${room.id}/messages`}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition"
                  >
                    {room.name}
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No memberships</p>
              )}
            </div>
          </div>
        </div>

        {/* Created At */}
        <div className="mt-6 text-gray-500 text-sm text-right">
          Account created at:{" "}
          <span className="font-medium text-gray-700">{user.created_at}</span>
        </div>
      </div>
    </div>
  );
}
