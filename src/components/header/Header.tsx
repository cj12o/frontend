import {MessageSquare,LogIn,UserPlus, Dice1} from 'lucide-react';
import {useNavigate, useParams,Link} from 'react-router-dom'
import {Button,Logo,LogoutBtn} from '../index.js'
import { useSelector } from 'react-redux'
import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import Notification from '@/pages/Notification.js';


function Header() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New message from Sarah', time: '5 min ago', read: false },
    { id: 2, message: 'Your order has been shipped', time: '1 hour ago', read: false },
    { id: 3, message: 'System update completed', time: '3 hours ago', read: true },
  ]);

  //dropDownStatus handles notification dropdown
  const [dropDownStatus,setDropDownStatus]=useState(false)
  
  const authStatus=useSelector((state:{authStatus:boolean})=>state.authStatus)
  const name=useSelector((state:{name:string})=>state.name)
  console.log(`Header name ${name}`)
  const navigate=useNavigate()
  const navItems=[
    {
      name:"login",
      topath:"/login",
      isactive:!authStatus
    },
    {
      name:"signup",
      topath:"/signup",
      isactive:!authStatus
    },
    {
      name:"profile",
      topath:`/profile/${name}`,
      isactive:authStatus
    },
    {
      name:"notification",
      topath:`/notifications`,
      isactive:authStatus
    }
  ]

  return(
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo/>
            <div className='text-xl text-black'>Welcome {localStorage.getItem("name")||"guest"}</div>
            <div className="flex items-center space-x-3">
              {
                navItems.filter(item=>item.isactive).map((item)=>{
                  if(item.name==="profile"){
                    return <div 
                    className='rounded-full h-10 w-10 text-center text-xl bg-red-500 overflow-hidden border-green-500 border-3 hover:shadow-xl'
                    onClick={()=>navigate(item.topath)}
                    >
                      {localStorage.getItem("profile_pic")!="null"?
                      <img src={localStorage.getItem("profile_pic")||""} 
                      alt="" 
                      />:localStorage?.getItem("name")?.charAt(0).toUpperCase()}
                    </div>
                  }
                  
                  return <Button onClick={()=>navigate(item.topath)} value={item.name} type="button"/>
                })
              }
              <div className='relative'>
              <div
                onClick={() => setDropDownStatus(!dropDownStatus)}
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition duration-200"
                >
                {
                  authStatus?<Bell className="text-gray-700 hover:text-blue-600" size={22} />:null
                }
              </div>
    
              {dropDownStatus && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 shadow-lg rounded-xl p-3 animate-fadeIn z-50">
                    <div className="text-gray-700 font-semibold mb-2">
                      Notifications:
                    </div>
                    <div className="space-y-2">
                      {
                        <Notification/>
                      }
                    
                      <div className="text-center text-sm text-blue-500 hover:underline cursor-pointer">
                        <Link to="/notifications">
                        View all
                        </Link>
                      </div>
                    </div>
                  </div>
              )}
              </div>
              <div
              onClick={()=>setDropDownStatus(false)}>
                {
                  authStatus?<LogoutBtn/>:null
                }
              </div>
          
            </div>
          </div>
        </div>
    </header>
  )
}

export default Header