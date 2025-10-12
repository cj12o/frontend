import { createReducer } from "@reduxjs/toolkit";
import Apierror from "../utils/api-error";
import axios from "axios";

const roomlist=async (room_id:number=0)=>{
    try{
        let url=import.meta.env.VITE_ROOMLST_EPT
        if(room_id>0){
           url=url+`?id=${room_id}`
        }
        const resp=await axios.get(url,
            {headers:{"Content-Type":"application/json"}}
        )
        console.log(`RESPONSE ${resp.data?.rooms}`)
        return resp.data
    }catch(e:any){
        const error=e.response?.message
        throw new Apierror(409,error)
    }
    
}

export {roomlist}

