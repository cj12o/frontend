import axios from "axios";

const postMsg=async (roomid:number,message:string)=>{
    try{
         const resp=await axios.post(import.meta.env.VITE_BASE_EPT+`rooms/${roomid}/messages/`
            ,{message}
            ,{headers:{"Content-Type":"application/json",
                "Authorization":`Token ${localStorage.getItem("cookie")}`
            }}
        )
        console.log(`resp postMsg:${resp.data}`)
        return resp.data

    }catch(e:any){
        const error=e?.response?.data
        console.log(`Error in postMsg ${error}`)
    }

}
// for room
const getMsg=async (roomid:number)=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_BASE_EPT+`rooms/${roomid}/messages/`
            ,{headers:{"Content-Type":"application/json"}}
        )
        console.log(resp.data)
        return resp.data

    }catch(e:any){
        const error=e?.response?.data
        console.log(`Error in postMsg ${error}`)
    }

}



export {postMsg,getMsg}

