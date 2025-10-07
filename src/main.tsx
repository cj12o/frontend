import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from "./store/store.js"


import Login from "./pages/Login.tsx"
import Signup from "./pages/Signup.tsx"
import Home from "./pages/Home.tsx"
import Room from './pages/Room.tsx'
import Profile from './pages/Profile.tsx'

const router=createBrowserRouter([
  {path:"/",element:<App/>,children:[
    {path:"/",element:<Home/>},
    {path:"/login",element:<Login/>},
    {path:"/signup",element:<Signup/>},
    {path:"/rooms/:id/messages",element:<Room />},
    {path:"/profile/:name",element:<Profile />}
  ]}
])

const root=createRoot(document.getElementById('root') as HTMLElement)
 
root.render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)
