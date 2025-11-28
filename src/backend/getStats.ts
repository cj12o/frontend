import axios from "axios";

let room_id_global:number=-1
let search_user_global:string=""

let nextUrl:string|null=null
let prevUrl:string|null=null

const getStats=async(room_id:number,search_user:string)=>{
    try{
        room_id_global=room_id
        search_user_global=search_user

        const data=new FormData()        
        data.append('searchUser',search_user_global)

        const resp=await axios.post(import.meta.env.VITE_ROOM_STATS_EPT+`${room_id_global}/`
            ,data
            ,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        )
        prevUrl=resp?.data.previous
        nextUrl=resp?.data.next

        return {
            data:resp?.data.results,
            status:200
        }
    }catch(e){
        return {
            data:"error",
            status:400
        }
    }
}



const getStatsNext=async()=>{
    try{
        if(!nextUrl) {
            throw new Error("No next page url")
        }
        
        const data=new FormData()
        data.append('searchUser',search_user_global)

        const resp=await axios.post(nextUrl
            ,data
            ,{
                headers:{
                    "Content-Type": "multipart/form-data",
                }
            }
        )

        return {
            data:resp?.data.results,
            status:200
        }
    }catch(e){
        return {
            data:"error",
            status:400
        }
    }
}


const getStatsPrev=async()=>{
    try{
        if(!prevUrl){
            throw new Error("No previous page url")
        }
        
        const data=new FormData()
        data.append('searchUser',search_user_global)

        const resp=await axios.post(prevUrl
            ,data
            ,{
                headers:{
                    "Content-Type": "multipart/form-data",
                }
            }
        )
     return {
            data:resp?.data.results,
            status:200
        }
    }catch(e){
        return {
            data:"error",
            status:400
        }
    }
}

const getHomePageStats=async()=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_BASE_EPT+`stats/`)
        return resp.data
    }catch(e){
        return {
            data:"error",
            status:400
        }
    }
}   
export {getStats,getStatsNext,getStatsPrev,getHomePageStats}

