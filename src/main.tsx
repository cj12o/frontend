import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from "./store/store.js"


import Cart from './pages/Cart.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'

const router=createBrowserRouter([
  {path:"/",element:<App/>,children:[
    {path:"/",element:<Home/>},
    {path:"/cart",element:<Cart/>},
    {path:"/login",element:<Login/>},
    {path:"/signup",element:<Signup/>}
  ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}>
      <App/>
    </RouterProvider>
  </Provider>
)
