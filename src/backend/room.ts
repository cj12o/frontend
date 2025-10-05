import { createReducer } from "@reduxjs/toolkit";
import Apierror from "../utils/api-error";
import axios from "axios";

const roomlist=async ()=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_ROOMLST_EPT,
            {headers:{"Content-Type":"application/json"}}
        )
        console.log(`RESPONSE ${resp.data?.rooms}`)
        return resp.data
    }catch(e:any){
        const error=e.response?.message
        throw new Apierror(409,error)
    }
    
}

const getMessages=async(roomid:number)=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_BASE_EPT+`rooms/${roomid}/messages/`,
            {headers:{"Content-Type":"application/json"}}
        )
        console.log(resp)
        return resp.data
    }catch(e:any){
        const error=e.response?.data?.errors
        throw new Apierror(409,error)
    }
}

export {roomlist,getMessages}