import React from 'react';
import { Camera, Mail, Hash } from 'lucide-react';

export default function UserProfile() {
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
            <div className="flex items-center gap-2 text-2xl font-semibold">
              @ChitranshJain
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-100">
              <Hash size={16} />
              <span>ID: 1024</span>
              <Mail size={16} />
              <span>chitransh@example.com</span>
            </div>
          </div>

          {/* Right side — Last seen */}
          <div className="text-md text-right text-gray-100">
            <div>Last seen:</div>
            <div>10 hrs ago</div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white relative shadow-xl font-semibold w-[70vw] h-[20vh] mt-3 text-black p-4 rounded-xl hover:shadow-xl shadow-black-600 ">
        <h2 className="text-lg font-semibold mb-2">Bio</h2>
        <p className="text-sm leading-relaxed">
          Hi! I'm CJ — a CSE student passionate about AI/ML, backend dev, and
          building real-world projects.
        </p>
      </div>

      {/* Rooms/Other Info */}
      <div className="grid p-3 bg-white shadow-xl w-[70vw] h-[30vh] mt-3 rounded-xl hover:shadow-xl shadow-black-600 ">
        <div className="flex">
          <div className="text-lg font-semibold mb-2">created_at:</div>
          <div className="mt-1 ml-2">09-01-2020</div>
        </div>
        <div className="flex">
          <div className="text-lg font-semibold mb-2">Roles:</div>
          <div className="mt-1 ml-2">@admin</div>
        </div>
        <div className="flex">
          <div className="text-lg font-semibold mb-2">Participation:</div>
          <div className="mt-1 ml-2">....</div>
        </div>
      </div>
    </div>
  );
}
