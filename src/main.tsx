import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.js";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";


import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile.tsx";

import RoomWrapper from "./pages/RoomWrapper.tsx";
// import Chatbot from './pages/Chatbot.tsx'
// import Poll from "./components/Poll.tsx";
import Roomcreation from "./pages/Roomcreation.tsx";
import Notification from "./pages/Notification.tsx";

import RoomEdit from "./pages/RoomEdit.tsx";
import Moderator from "./pages/Moderator.tsx";
import Moderation_messages from "./pages/Moderation_messages.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/profile/:name", element: <Profile /> },
      { path: "/createRoom", element: <Roomcreation /> },
      { path: "/rooms/:id/messages", element: <RoomWrapper /> },
      // { path: "/polls/:id/", element: <Poll id={2} /> },
      { path: "/notifications", element: <Notification /> },
      { path: "/rooms/:id/edit", element: <RoomEdit /> },
      { path: "/moderator", element: <Moderator /> },
      { path: "/moderator/rooms/:id", element: <Moderation_messages /> },
    ],
  },
]);

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </>,
);
