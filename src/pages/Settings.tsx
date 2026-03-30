import { useSelector } from "react-redux"
import { Settings as SettingsIcon, Bell, Lock, LogOut, User } from "lucide-react"

export default function Settings() {
  const userName = useSelector((state: any) => state.name)
  const authStatus = useSelector((state: any) => state.authStatus)

  if (!authStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Please login to access settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-indigo-600" />
            Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={userName}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                <span className="text-sm text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                <span className="text-sm text-gray-700">Message notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                <span className="text-sm text-gray-700">Room updates</span>
              </label>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Privacy & Security</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-left">
                Change Password
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-left">
                Two-Factor Authentication
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <LogOut className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
