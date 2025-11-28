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
        const name=resp.data?.name
        const profile_pic=resp.data?.profile_pic

        // console.log("Auth js full data=>",resp.data)
        // console.log("Dispatching login with payload:", {cookie});
        dispatch(reducerLogin({cookie,name,profile_pic}))
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

const logout=async (dispatch:Dispatch<any>,visited_rooms:object)=>{
    try{
        const data={
            visited_rooms:visited_rooms,
            sessionId:localStorage.getItem("sessionId")
        }
        const resp=await axios.post(import.meta.env.VITE_LOGOUT_EPT
            ,data
            ,{headers:{
                'Authorization': `Token ${localStorage.getItem('cookie')}`
            }})
        if(resp.status==200){
            dispatch(reducerLogout())
        }
    }
    catch(e:any){
        const error=e.response?.data?.message||"unknown error"
        console.log(`Error ${e}`)
        throw new Apierror(409,error)
    }

}


export {login,signup,logout}
