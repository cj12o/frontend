// import { createSlice } from "@reduxjs/toolkit";

// const authSlice=createSlice({
//     name:"auth",
//     initialState:{
//         authStatus:false,
//         // userData:null
//     },
//     reducers:{
//         login:(state,action)=>{
//             state.authStatus=true
//             // state.userData=action.payload.userData
//         },
//         logout:(state,action)=>{
//             state.authStatus=false
//             // state.userData=action.payload.userData
//         }
//     },
    
// })

// export const {login,logout}=authSlice.actions
// export default authSlice.reducer
import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:"auth",
    initialState:{
        authStatus:JSON.parse(localStorage.getItem("authStatus")||"false"),
        cookie:localStorage.getItem("cookie")||null
    },
    reducers:{
        login:(state,action)=>{
             // state.userData=action.payload.userData

             ///debugging reducer
            console.log("Reducer got payload:", action.payload);
            state.authStatus=true
            state.cookie=action.payload.cookie

            //local storage
            localStorage.setItem("cookie",action.payload.cookie)
            localStorage.setItem("authStatus",JSON.stringify(true))
           
        },
        logout:(state)=>{
            localStorage.removeItem("cookie")
            localStorage.removeItem("authStatus")
            state.authStatus=false
            state.cookie=null
        }
    },
    
})

export const {login,logout}=authSlice.actions
export default authSlice.reducer