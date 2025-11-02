import { createRoot } from 'react-dom/client'
import './index.css'
import { createContext,useContext } from 'react'
import App from './App.js'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from "./store/store.js"
import useWebSocket from 'react-use-websocket'

import Login from "./pages/Login.tsx"
import Signup from "./pages/Signup.tsx"
import Home from "./pages/Home.tsx"
import Profile from './pages/Profile.tsx'
import Form from './pages/Form.tsx'
import RoomWrapper from './pages/RoomWrapper.tsx'
import Chatbot from './pages/Chatbot.tsx'
import Poll from './components/Poll.tsx'

const router=createBrowserRouter([
  {path:"/",element:<App/>,children:[
    {path:"/",element:<Home/>},
    {path:"/login",element:<Login/>},
    {path:"/signup",element:<Signup/>},
    {path:"/profile/:name",element:<Profile />},
    {path:"/createRoom",element:<Form/>},
    {path:"/rooms/:id/messages",element:<RoomWrapper />},
    {path:"/chatbot",element:<Chatbot/>},
    {path:"/polls/:id/",element:<Poll id={2}/>}
  ]}
])

const root=createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <>
  <Provider store={store}>
      <RouterProvider router={router}/>
  </Provider>
  </>
)
