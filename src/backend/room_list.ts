import Apierror from "../utils/api-error";
import axios from "axios";

let posturl:string|null=null
let preurl:string|null=null 


const roomlist=async (need:number=-1,keyword:string="")=>{
    try{
        let url=import.meta.env.VITE_ROOMLST_EPT+`?need=${need}&keyword=${keyword}`
       
        let cookie=localStorage.getItem("cookie")||""
        if(cookie!=="null" && cookie!=="undefined" && cookie!==""){
            cookie=`Token ${cookie}`
        }
        else cookie=""

        const resp=await axios.post(url, {}, {
            headers:{"Content-Type":"application/json",
                "Authorization":cookie
            }}
        )

        // console.log(`RESPONSE ${resp.data}`)
        posturl=resp?.data?.next
        preurl=resp?.data?.previous
        return resp?.data
        
    }catch(e:any){
        const error = e.response?.data?.ERROR || e.response?.data?.message || e.message || "Failed to fetch rooms"
        console.error("Room list API error:", error, e.response?.data)
        throw new Apierror(e.response?.status || 500, error)
    }
    
}



const roomlistpost=async (need:number,keyword:string)=>{

    try{
        const url=posturl||import.meta.env.VITE_ROOMLST_EPT

        const cookie=`Token ${localStorage.getItem("cookie")}`?localStorage.getItem("cookie"):""   

        const resp=await axios.post(url, {}, {
            headers:{"Content-Type":"application/json",
                "Authorization":cookie
            }}
        )

        // console.log(`RESPONSE ${resp.data}`)
        posturl=resp?.data?.next
        preurl=resp?.data?.previous
        return resp?.data

    }catch(e:any){
        const error = e.response?.data?.ERROR || e.response?.data?.message || e.message || "Failed to fetch next page"
        console.error("Room list next page API error:", error, e.response?.data)
        throw new Apierror(e.response?.status || 500, error)
    }
    
}


const roomlistprev=async (need:number,keyword:string)=>{

    try{
        const url=preurl||import.meta.env.VITE_ROOMLST_EPT
        
        const cookie=`Token ${localStorage.getItem("cookie")}`?localStorage.getItem("cookie"):""

        const resp=await axios.post(url, {}, {
            headers:{"Content-Type":"application/json",
                "Authorization":cookie
            }}
        )

        // console.log(`RESPONSE ${resp.data}`)
        posturl=resp?.data?.next
        preurl=resp?.data?.previous
        return resp?.data
    
    }catch(e:any){
        const error = e.response?.data?.ERROR || e.response?.data?.message || e.message || "Failed to fetch previous page"
        console.error("Room list previous page API error:", error, e.response?.data)
        throw new Apierror(e.response?.status || 500, error)
    }
    
}


export {roomlist,roomlistprev,roomlistpost}

