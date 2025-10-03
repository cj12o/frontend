import {MessageSquare,LogIn,UserPlus} from 'lucide-react';
import {useNavigate} from 'react-router-dom'
import {Button,Logo,LogoutBtn} from '../index.js'
import { useSelector } from 'react-redux'


function Header() {

  const authStatus=useSelector((state:{authStatus:boolean})=>state.authStatus)

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
  ]
  
  // return (
  //   <>
  //   <div className='bg-gray-300 flex flex-wrap p-1'>
  //   <nav className='flex flex-wrap'>
  //     <ul className='flex flex-wrap p-2 '>
  //       {
  //       navItems
  //       .filter(item => item.isactive)
  //       .map((item)=>{
  //         return <li key={item.name} value={item.name} className='m-1'>
  //           <Button  onClick={()=>{
  //             navigate(item.topath)
  //           }}>
  //             {item.name}
  //           </Button>
  //         </li>
  //       })
  //     }
  //     </ul> 
  //     <div className='absolute mt-2.5 right-5 rounded'>
  //       {
  //         authStatus?(<LogoutBtn/>):null
  //       }
  //     </div>
  //   </nav>
  //   </div>
  //   </>
  // )

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