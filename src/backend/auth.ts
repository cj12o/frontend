import axios from "axios";
import Apierror from "../utils/api-error.ts";
import { login as reducerLogin,logout as reducerLogout } from "../store/authSlice.ts";
import type { Dispatch } from "react";



const login= async (email:string,password:string,dispatch:Dispatch<any>) => {
    try{
        ///LEARNING return here return promise to submit handler 
        // if there is no return axios then undefined gets returned 
        const resp=await axios.post(import.meta.env.VITE_LOGIN_EPT, 
        {email,password},
        {
            headers:{"Content-Type":"application/json"},
            withCredentials:true
        })
        console.log(`response :${resp}`)
        const cookie=resp.data?.token
        const is_online=resp.data?.profile?.[0]?.is_online
        const bio=resp.data?.profile?.[0]?.bio
        const last_seen=resp.data?.profile?.[0]?.last_seen
        const profile_pic=resp.data?.profile?.[0]?.profile_pic
        const roles=resp.data?.profile?.[0]?.roles
        const name=resp.data?.name


        console.log("Auth js full data=>",resp.data)
        console.log("Dispatching login with payload:", {cookie});
        dispatch(reducerLogin({cookie,bio,is_online,last_seen,profile_pic,roles,name}))
        return resp.status
    }
    catch(e:any){
        // console.log(`resp ${e.response}`)
        // if (e.response && e.response?.data?.errors?.non_field_errors )
        //     console.log(e.response?.data?.errors?.non_field_errors?.[0]);
        dispatch(reducerLogout())
        const error=e.response?.data?.errors?.non_field_errors?.[0]||"unknown error"
        // console.log(`auth js=>${e.response.data.errors[0]}`)
        throw new Apierror(409,error)
    }
}

const signup=async (username:string,email:string,password:string)=>{
    try{
        const resp=await axios.post(import.meta.env.VITE_SIGNUP_EPT,
        {username,email,password},
        {
            headers:{"Content-Type": "application/json" },
            withCredentials:true    
        })
        // dispatch(reducerLogin({}))
        console.log("Auth JS ,signup=>",resp.data?.userdata)
        // return resp.status
    }
    catch (e: any) {
       console.log("Full error:", e.response?.data);

        const errors = e.response?.data?.errors as Record<string, string[]> | undefined;

        const errorMessage =
            errors?.non_field_errors?.[0] || // backend non-field errors
            (errors && Object.values(errors)[0]?.[0]) || // first field error
            "Unknown error";

        throw new Apierror(409, errorMessage);
    }
}

const logout=async (dispatch:Dispatch<any>)=>{
    try{
        const resp=axios.get(import.meta.env.VITE_LOGOUT_EPT,
            {headers:{
                'Authorization': `Token ${localStorage.getItem('cookie')}`
            }})
            console.log(`Cookie:${localStorage.getItem('cookie')}`)
            dispatch(reducerLogout())

    }
    catch(e:any){
        const error=e.response?.data?.message||"unknown error"
        console.log(`Error ${e}`)
        throw new Apierror(409,error)
    }

}


export {login,signup,logout}
