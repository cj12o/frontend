import React from 'react'
import { useSelector } from 'react-redux';



const sidebarfooter = () => {
  const name = useSelector((state: any) => state.name) || "guest";
  const profile_pic = useSelector((state: any) => state.profile_pic);

  return (
    <a href={`/profile/${name}`} className='w-full flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-100/80 transition-colors cursor-pointer group'>
      {/* Profile Image */}
      <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0 transition-all group-hover:border-blue-400">
        {profile_pic ? (
          <img
            src={profile_pic}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-bold text-gray-600">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name Section */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        <p className="text-xs text-gray-500 truncate">User Profile</p>
      </div>

      {/* Chevron Icon */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}

export default sidebarfooter