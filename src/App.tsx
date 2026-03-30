
import './App.css'
import { Outlet } from 'react-router-dom'
import {Header} from './components/index.js'
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { TopicProvider } from './providers/topic_provider.js'

function App() {
  return (
    <div className='w-full h-full'>
      <Header/>
      <TopicProvider>
      <SidebarProvider>
        <AppSidebar />
      <main className='flex-1 overflow-auto'>
        <Outlet />
      </main>
      </SidebarProvider>
      </TopicProvider>
    </div>
  )
}

export default App
