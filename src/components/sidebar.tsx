import { getTopics as getTopicsBackend } from "@/backend/topic"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar"
import { useTopicContext } from "@/context/topics_context"
import { type TopicType } from "@/types/Room.type"
import { useEffect } from "react"


import { SidebarTrigger } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"

export function AppSidebar() {
  
  const {topics,setTopics}=useTopicContext()

  const get_topics=async()=>{
    try {
      const resp = await getTopicsBackend();
      if (resp && Array.isArray(resp)) {
        setTopics(resp);
      } else {
        setTopics([]);
      }
    } catch (e: any) {
      console.error("Error fetching topics:", e);
      setTopics([]);
    }
  }
  
  useEffect(()=>{
    get_topics()
  },[])


  return (
    <Sidebar collapsible="icon" className="sticky overflow-visible border-r">
        
        <div className="absolute right-0 translate-x-1/2 top-20 z-50">
          <SidebarTrigger />
        </div>
        
        <SidebarContent className=" bg-black">
          <SidebarGroup id="Account" className="bg-red-400">
          {
            topics.map((topic)=>{
              return(
                <SidebarGroup key={topic.id}>
                  <SidebarGroupLabel>{topic.topic}</SidebarGroupLabel>
                  <SidebarGroupContent>
                  </SidebarGroupContent>
                </SidebarGroup>
              )
            })
          }
          </SidebarGroup >
          <SidebarGroup id="Topics" className="bg-red-900 h-fit">
            <SidebarGroupLabel>Topics</SidebarGroupLabel>
              {
                topics.map((topic)=>{
                  return(
                  
                    <SidebarGroupContent id={topic.topic}>
                      {topic.topic}
                    </SidebarGroupContent>
                  )
                })
              }
            </SidebarGroup >
          </SidebarContent>
        <SidebarFooter />
      
      
          
        
        
      
    </Sidebar>
  )
}


export function FloatingSidebarTrigger() {
  return (
    <div className="fixed top-20 left-60 z-50">
      <SidebarTrigger>
        <button className="group relative flex items-center justify-center w-11 h-11 rounded-xl 
          border border-white/20 bg-white/10 backdrop-blur-md shadow-lg
          transition-all duration-300 hover:scale-105 hover:bg-white/20 active:scale-95">

          {/* glow */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
            transition duration-300 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-md" />

          {/* icon */}
          <Menu className="relative z-10 w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
        </button>
      </SidebarTrigger>
    </div>
  )
}