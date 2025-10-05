import { createSlice } from "@reduxjs/toolkit";


const authSlice=createSlice({
    name:"auth",
    initialState:{
        authStatus:JSON.parse(localStorage.getItem("authStatus")||"false"),
        cookie:localStorage.getItem("cookie")||null,
        is_online:localStorage.getItem("is_online")||false,
        bio:localStorage.getItem("bio")||null,
        last_seen:localStorage.getItem("last_seen")||null,
        profile_pic:localStorage.getItem("profile_pic")||null,
        roles:localStorage.getItem("roles")||null,
        name:localStorage.getItem("name")||null
    },
    reducers:{
        login:(state,action)=>{
             // state.userData=action.payload.userData

             ///debugging reducer
            console.log("Reducer got payload:", action.payload);
            state.authStatus=true
            state.cookie=action.payload.cookie
            state.bio=action.payload.bio
            state.last_seen=action.payload.last_seen
            state.is_online=action.payload.is_online
            state.roles=action.payload.roles
            state.name=action.payload.name
            state.profile_pic=action.payload.profile_pic

            //local storage
            localStorage.setItem("cookie",action.payload.cookie)
            localStorage.setItem("authStatus",JSON.stringify(true))
            localStorage.setItem("bio",action.payload.bio)
            localStorage.setItem("last_seen",JSON.stringify(action.payload.last_seen))
            localStorage.setItem("profile_pic",JSON.stringify(action.payload.profile_pic))
            localStorage.setItem("roles",action.payload.roles)
            localStorage.setItem("name",action.payload.name)
            localStorage.setItem("is_online",action.payload.is_online)
        },
        logout:(state)=>{
            localStorage.removeItem("cookie")
            localStorage.removeItem("authStatus")
            localStorage.removeItem("bio")
            localStorage.removeItem("last_seen")
            localStorage.removeItem("profile_pic")
            localStorage.removeItem("roles")
            localStorage.removeItem("name")
            localStorage.removeItem("is_online")
            
            state.authStatus=false
            state.cookie=null
            state.bio=null
            state.is_online=false
            state.last_seen=null
            state.name=null
            state.profile_pic=null
            state.roles=null
        }
    },
    
})

export const {login,logout}=authSlice.actions
export default authSlice.reducer