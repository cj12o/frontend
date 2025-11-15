import { createReducer } from "@reduxjs/toolkit";
import Apierror from "../utils/api-error";
import axios from "axios";

let posturl:string|null=null
let preurl:string|null=null


const roomlist=async (need:number,keyword:string)=>{
    // console.log(`ROOM LST COOKIE SENT ${localStorage.getItem("cookie")}`)
    try{
        

        let url=import.meta.env.VITE_ROOMLST_EPT+`?need=${need}&keyword=${keyword}`
       
        
        const resp=await axios.post(url,
            {headers:{"Content-Type":"application/json",
                // "Authorization":`Token ${localStorage.getItem("cookie")}`
            }}
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



const roomlistpost=async (need:number,keyword:string)=>{

    try{
        const url=posturl||import.meta.env.VITE_ROOMLST_EPT
        console.log(`POST UEL:${url}`)
        const resp=await axios.post(url,
            {headers:{"Content-Type":"application/json",
                // "Authorization":`Token ${localStorage.getItem("cookie")}`
            }}
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


const roomlistprev=async (need:number,keyword:string)=>{

    try{
        const url=preurl||import.meta.env.VITE_ROOMLST_EPT
        const resp=await axios.post(url,
            {headers:{"Content-Type":"application/json",
                // "Authorization":`Token ${localStorage.getItem("cookie")}`
            }}
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


export {roomlist,roomlistprev,roomlistpost}

