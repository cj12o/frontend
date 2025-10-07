import React, { useEffect, useState } from 'react';
import { Camera, Mail, Hash } from 'lucide-react';

import { getProfile } from '@/backend/profile.ts';
import { useParams } from 'react-router-dom';


// {
//     "userdata": [
//         {
//             "id": 1,
//             "bio": "Hi ✌️😀😀",
//             "last_seen": "2025-10-05T15:57:39Z",
//             "is_online": true,
//             "profile_pic": null,
//             "roles": "admin",
//             "created_at": "2025-10-05",
//             "user": 1
//         }
//     ],
//     "name": "chitransh",
//     "member_rooms": [
//         "LA pulgha"
//     ],
//     "rooms_created": [
//         [
//             "Ai",
//             "Alpha",
//             "beta"
//         ]
//     ]
// }

export default function UserProfile() {

  type userdata={
    id:number,
    bio: string,
    last_seen:string,
    is_online: boolean,
    profile_pic: any,
    roles:string,
    created_at:string,
    user:number
  }
    // from resp
  type userData={
    userdata:userdata [],
    name:string,
    member_rooms:string [],
    rooms_created:string [] []
  }


  const [data,setData]=useState<userData|null>(null)

  const getProfileData=async (name:string)=>{
    try{
      const resp=await getProfile(name)
      console.log(resp)
      setData(resp)
      
    }catch(e){

    }
  }
  const params = useParams<{name:string}>();
  useEffect(() => {
    if(!params.name) return
    getProfileData(params?.name);
  }, []);
  return (
    <div className="relative grid justify-center h-screen items-center">
      {/* Top Profile Card */}
      <div className="bg-indigo-300 w-[70vw] h-[40vh] mt-3 text-white rounded-xl shadow-xl hover:shadow-xl shadow-black-600 ">
        {/* Cover background */}
        <div className="h-2/3 overflow-hidden rounded-t-xl bg-gradient-to-r from-blue-500 to-purple-600">
          {/* Profile Photo */}
          <div className="bg-blue-900 relative h-[20vh] w-[20vh] ml-6 mt-6 rounded-full border-2 border-white flex justify-center items-center text-4xl">
            CJ
            {/* Camera + Online Dot */}
            <div className="absolute right-1 bottom-1 justify-items-center bg-white h-[5vh] w-[5vh] ml-6 mt-6 rounded-full border-2 hover:shadow-xl flex items-center justify-center">
              <Camera className="text-black h-[2.5vh]" />
              {/* Online dot */}
              <div className="absolute right-[2px] bottom-[2px] bg-green-500 h-[1vh] w-[1vh] rounded-full border border-white"></div>
            </div>
          </div>
        </div>

        {/* Name, ID, Mail (left) and Last seen (right) */}
        <div className="flex justify-between items-center px-6 mt-2">
          {/* Left side */}
          <div className="flex flex-col">
            {
              data && <div className="flex items-center gap-2 text-2xl font-semibold">{data.name}</div>
            }
            
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-100">
              <Hash size={16} />
              <span>ID:{data && data.userdata[0].id}</span>
              <Mail size={16} />
              <span>chitransh@example.com</span>
            </div>
          </div>

          {/* Right side — Last seen */}
          <div className="text-md text-right text-gray-100">
            <div>Last seen:</div>
            {data && <div>{data.userdata[0].last_seen}</div>}10hrs ago
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white relative shadow-xl font-semibold w-[70vw] h-[20vh] mt-3 text-black p-4 rounded-xl hover:shadow-xl shadow-black-600 ">
        <h2 className="text-lg font-semibold mb-2">Bio</h2>
        <p className="text-sm leading-relaxed">
          {data &&  data.userdata[0].bio}
        </p>
      </div>

      {/* Rooms/Other Info */}
      <div className="grid p-3 bg-white shadow-xl w-[70vw] h-[30vh] mt-3 rounded-xl hover:shadow-xl shadow-black-600 ">
        <div className="flex">
          <div className="text-lg font-semibold mb-2">created_at:</div>
          <div className="mt-1 ml-2">{data && data.userdata[0].created_at}</div>
        </div>
        <div className="flex">
          <div className="text-lg font-semibold mb-2">Roles:</div>
          <div className="mt-1 ml-2">{data && data.userdata[0].roles}</div>
        </div>
        <div className="flex">
          <div className="text-lg font-semibold mb-2">Author:</div>
          <div className="mt-1 ml-2">{data && (data.rooms_created).map((room)=>{
            return <div>{room+`  `}</div>
          })}</div>
        </div>
        <div className="flex">
          <div className="text-lg font-semibold mb-2">Member:</div>
          <div className="mt-1 ml-2">....</div>
        </div>
      </div>
    </div>
  );
}
