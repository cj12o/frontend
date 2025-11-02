import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4, v1 } from 'uuid';


type History={
    id:number,
    timespent:number,
}


const authSlice=createSlice({
    name:"auth",
    initialState:{
        authStatus:JSON.parse(localStorage.getItem("authStatus")||"false"),
        cookie:localStorage.getItem("cookie")||null,
        visitedRoomId:[] as History [],
        sessionId:localStorage.getItem("sessionId")||null,
        name:localStorage.getItem("name")||"",
        profile_pic:localStorage.getItem("profile_pic")||null

    },
    reducers:{
        login:(state:any,action)=>{
            const seshid=uuidv4()
            // console.log("Reducer got payload:", action.payload);
            state.authStatus=true
            state.cookie=action.payload.cookie
            state.sessionId=seshid
            state.name=action.payload.name
            //local storage
            localStorage.setItem("cookie",action.payload.cookie)
            localStorage.setItem("authStatus",JSON.stringify(true))
            localStorage.setItem("sessionId",seshid)
            localStorage.setItem("name",action.payload.name)
            localStorage.setItem("profile_pic",action.payload.profile_pic)
        },
        logout:(state)=>{
            
            localStorage.removeItem("cookie")
            localStorage.removeItem("authStatus")
            localStorage.removeItem("sessionId")
            localStorage.removeItem("name")
            localStorage.removeItem("profile_pic")

            // state.visitedRoomId=[]
            state.authStatus=false
            state.cookie=null
            state.sessionId=null
            state.name=""
            state.profile_pic=null
        },
        addtoHistory:(state,action)=>{
            // console.log("Reducer got payload:", action.payload);
            const id=Number(action.payload.id)
            state.visitedRoomId.push({id:id,timespent:action.payload.time_spent})
        }
    },
    
})

export const {login,logout,addtoHistory}=authSlice.actions
export default authSlice.reducer