import React from 'react'
import { MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
function Logo() {
  return (
    <Link to="/">
    <div className="flex items-center space-x-3">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
        <MessageSquare className="w-6 h-6 text-white" />
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        ChatRooms
      </h1>
    </div>
    </Link>
  )
}

export default Logo