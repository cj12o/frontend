import { createSlice } from "@reduxjs/toolkit";



type History={
    id:number,
    date:String,
}


const authSlice=createSlice({
    name:"auth",
    initialState:{
        authStatus:JSON.parse(localStorage.getItem("authStatus")||"false"),
        cookie:localStorage.getItem("cookie")||null,
        visitedRoomId:[] as History []
    },
    reducers:{
        login:(state,action)=>{

            // console.log("Reducer got payload:", action.payload);
            state.authStatus=true
            state.cookie=action.payload.cookie

            //local storage
            localStorage.setItem("cookie",action.payload.cookie)
            localStorage.setItem("authStatus",JSON.stringify(true))
        
            
        },
        logout:(state)=>{
            localStorage.removeItem("cookie")
            localStorage.removeItem("authStatus")


            // state.visitedRoomId=[]
            state.authStatus=false
            state.cookie=null
        },
        addtoHistory:(state,action)=>{
            console.log("Reducer got payload:", action.payload);
            state.visitedRoomId.push({id:action.payload,date:new Date().toLocaleString()})
        }
    },
    
})

export const {login,logout,addtoHistory}=authSlice.actions
export default authSlice.reducer