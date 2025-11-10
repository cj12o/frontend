import { createReducer } from "@reduxjs/toolkit";
import Apierror from "../utils/api-error";
import axios from "axios";

let posturl:string|null=null
let preurl:string|null=null

const roomlist=async (room_id:number=0,topic:string="")=>{

    try{
        type Data={
            topic:string
        }
        const data:Data={
            topic:""
        }

        let url=import.meta.env.VITE_ROOMLST_EPT
        if(room_id>0){
           url=url+`?id=${room_id}`
        }
        if(topic.trim().length>0){
            data.topic=topic
        }
        
        const resp=await axios.post(url,
            data,
            {headers:{"Content-Type":"application/json"}}
        )
        // console.log(`RESPONSE ${resp.data}`)
        posturl=resp?.data?.next
        preurl=resp?.data?.next
        return resp?.data
        
    }catch(e:any){
        const error=e.response?.message
        throw new Apierror(409,error)
    }
    
}



const roomlistpost=async (room_id:number=0,topic:string="")=>{

    try{
        type Data={
            topic:string
        }
        const data:Data={
            topic:""
        }
        if(!posturl) return
        let url=posturl
        if(room_id>0){
           url=url+`?id=${room_id}`
        }
        if(topic.trim().length>0){
            data.topic=topic
        }
        
        const resp=await axios.post(url,
            data,
            {headers:{"Content-Type":"application/json"}}
        )
        // console.log(`RESPONSE ${resp.data}`)
        posturl=resp?.data?.next
        preurl=resp?.data?.next
        return resp?.data
        
    }catch(e:any){
        const error=e.response?.message
        throw new Apierror(409,error)
    }
    
}


const roomlitprev=async (room_id:number=0,topic:string="")=>{

    try{
        type Data={
            topic:string
        }
        const data:Data={
            topic:""
        }
        if(!preurl) return
        let url=preurl
        if(room_id>0){
           url=url+`?id=${room_id}`
        }
        if(topic.trim().length>0){
            data.topic=topic
        }
        
        const resp=await axios.post(url,
            data,
            {headers:{"Content-Type":"application/json"}}
        )
        // console.log(`RESPONSE ${resp.data}`)
        posturl=resp?.data?.next
        preurl=resp?.data?.next
        return resp?.data
        
    }catch(e:any){
        const error=e.response?.message
        throw new Apierror(409,error)
    }
    
}


export {roomlist,roomlitprev,roomlistpost}

