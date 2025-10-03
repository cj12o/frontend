// import React from 'react'

// function Home() {

//   return (
//     <div className='justify-center items-center'>
//       <h1>Hi welcome</h1>
//     </div> 
     
//   )
// }

// export default Home

import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Users, TrendingUp, Hash, Clock, User, LogIn, UserPlus } from 'lucide-react';

export default function ChatroomHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const topics = [
    { id: 'all', name: 'All Topics', count: 24 },
    { id: 'tech', name: 'Technology', count: 8 },
    { id: 'gaming', name: 'Gaming', count: 6 },
    { id: 'music', name: 'Music', count: 4 },
    { id: 'sports', name: 'Sports', count: 3 },
    { id: 'general', name: 'General', count: 3 }
  ];

  const rooms = [
    {
      id: 1,
      name: 'Python Developers Hub',
      description: 'Discuss Python, Django, FastAPI and web development',
      topic: 'Technology',
      host: 'sarah_dev',
      members: 47,
      messages: 1240,
      active: true,
      lastActivity: '2m ago'
    },
    {
      id: 2,
      name: 'Indie Game Dev',
      description: 'Share your game dev journey and get feedback',
      topic: 'Gaming',
      host: 'pixel_master',
      members: 32,
      messages: 856,
      active: true,
      lastActivity: '5m ago'
    },
    {
      id: 3,
      name: 'Late Night Lounge',
      description: 'Casual chats about anything and everything',
      topic: 'General',
      host: 'night_owl',
      members: 89,
      messages: 3421,
      active: true,
      lastActivity: '1m ago'
    },
    {
      id: 4,
      name: 'React & Frontend',
      description: 'Modern frontend development with React, Vue, and more',
      topic: 'Technology',
      host: 'jsx_ninja',
      members: 56,
      messages: 2103,
      active: false,
      lastActivity: '1h ago'
    },
    {
      id: 5,
      name: 'Music Production',
      description: 'Beats, mixing, and production techniques',
      topic: 'Music',
      host: 'beat_maker',
      members: 28,
      messages: 671,
      active: true,
      lastActivity: '8m ago'
    },
    {
      id: 6,
      name: 'Football Fanatics',
      description: 'All things football - tactics, transfers, match analysis',
      topic: 'Sports',
      host: 'goal_keeper',
      members: 64,
      messages: 1893,
      active: false,
      lastActivity: '23m ago'
    }
  ];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || room.topic.toLowerCase() === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Find Your Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join conversations that matter. Create rooms, connect with people, share ideas.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none text-lg shadow-sm"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Rooms</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Online Users</p>
                <p className="text-3xl font-bold text-gray-900">342</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Messages Today</p>
                <p className="text-3xl font-bold text-gray-900">8.2K</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Topics */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Topics</h3>
                <Hash className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-2">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                      selectedTopic === topic.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{topic.name}</span>
                      <span className={`text-sm ${
                        selectedTopic === topic.id ? 'text-indigo-100' : 'text-gray-500'
                      }`}>
                        {topic.count}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button className="w-full mt-6 flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition font-medium">
                <Plus className="w-5 h-5" />
                <span>Create Room</span>
              </button>
            </div>
          </div>

          {/* Main Content - Room List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedTopic === 'all' ? 'All Rooms' : `${topics.find(t => t.id === selectedTopic)?.name} Rooms`}
              </h3>
              <span className="text-gray-600">{filteredRooms.length} rooms</span>
            </div>

            <div className="space-y-4">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-200 transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                          {room.name}
                        </h4>
                        {room.active && (
                          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Active</span>
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{room.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Hash className="w-4 h-4" />
                          <span>{room.topic}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{room.host}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{room.lastActivity}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{room.members}</span>
                        <span className="text-gray-500">members</span>
                      </span>
                      <span className="flex items-center space-x-1 text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium">{room.messages}</span>
                        <span className="text-gray-500">messages</span>
                      </span>
                    </div>
                    
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition opacity-0 group-hover:opacity-100">
                      Join Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}