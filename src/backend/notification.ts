import axios from "axios";

const getNotification=async ()=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_BASE_EPT+`notify/`
            ,{headers:{
                "Authorization":`Token ${localStorage.getItem("cookie")}`
            }}
        )
        return resp.data.notifications

    }catch(e:any){
        // const error=e?.response?.data
        // console.log(`Error in postMsg ${error}`)
    }

}


const getNotificationCount=async ()=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_BASE_EPT+`notify/count/`
            ,{headers:{
                "Authorization":`Token ${localStorage.getItem("cookie")}`
            }}
        )
    
        return resp.data.count

    }catch(e:any){
        // const error=e?.response?.data
        // console.log(`Error in postMsg ${error}`)
    }

}

export {getNotification,getNotificationCount}