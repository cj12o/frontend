import { useState, useRef } from "react";
import { Button } from "./index.js";
import { useDispatch, useSelector } from "react-redux";
import { logout as reducerLogout } from "../store/authSlice.js";
import { useNavigate } from "react-router-dom";
import { logout as logoutBackend } from "../backend/auth.ts";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const visitedRooms = useSelector((state: any) => state.visitedRoomId);

  // store latest state in a ref
  const visitedRoomsRef = useRef(visitedRooms);
  visitedRoomsRef.current = visitedRooms;

  const [_error, setError] = useState("");


  const logoutHandler = async() => {
    try {
      await logoutBackend(dispatch, visitedRoomsRef.current);
      dispatch(reducerLogout());
      alert("Suggesfully logged out");
      navigate("/");
    } catch (e: any) {
      setError(e.message);
    }
  };
  return <Button onClick={(e:any)=>{
    e.preventDefault();
    logoutHandler();
  }} value="Logout"></Button>;
}

export default LogoutBtn;
