import type { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { setName as reducerSetName,setProfile as reducerSetProfile } from "../store/authSlice"; 





const getProfile=async (name:string)=>{
    try{
        
        const resp=await axios.get(import.meta.env.VITE_PROFILE_EPT+`${name}/`,
            {
                headers:{"Content-Type":"application/json"}
            }
        )
        console.log(`Respnose getProfile:${resp.data}`)
        return resp.data
    }
    catch(e:any){
        console.log(`Error in getProfile:${e}`)
    }
}


const updateProfile=async(file:File|null=null,delete_profile_pic:boolean=false,bio:string="",email_id:string="",username:string="",dispatch:Dispatch<any>)=>{
    try{
        const data=new FormData()
        if (file) data.append('profile_pic',file)
        if (delete_profile_pic) data.append('delete_profile_pic',"true")
        if (bio) data.append('bio',bio)
        if (email_id) data.append('email_id',email_id)
        if (username) data.append('username',username)

        const resp=await axios.patch(import.meta.env.VITE_PROFILE_EPT+`${localStorage.getItem("name")}/`,
            data,
            {
                headers:{
                    "Authorization":`Token ${localStorage.getItem("cookie")}`
                }
            }
        )
        if(resp.status===200){
            // dispatch(reducerLogin({cookie,name,profile_pic}))
            dispatch(reducerSetName(username))
            dispatch(reducerSetProfile(resp.data.profile_pic))   
        }
        // console.log(`Respnose getProfile:${resp.data}`)
        return resp.status
    }
    catch(e:any){
        console.log(`Error in updateProfile:${e}`)
        return 400
    }
}


export {getProfile,updateProfile}