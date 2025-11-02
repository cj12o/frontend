import {MessageSquare,LogIn,UserPlus} from 'lucide-react';
import {useNavigate, useParams} from 'react-router-dom'
import {Button,Logo,LogoutBtn} from '../index.js'
import { useSelector } from 'react-redux'


function Header() {

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
      name:"chatbot",
      topath:"/chatbot",
      isactive:true,
    }
  ]

  return(
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo/>
            
            <div className="flex items-center space-x-3">
              {
                navItems.filter(item=>item.isactive).map((item)=>{
                  return <Button onClick={()=>navigate(item.topath)} value={item.name} type="button"/>
                })
              }

              {
                authStatus?<LogoutBtn/>:null
              }
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header