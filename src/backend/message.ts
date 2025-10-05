import axios from "axios";

const postMsg=async (roomid:number,message:string)=>{
    try{
         const resp=await axios.post(import.meta.env.VITE_BASE_EPT+`rooms/${roomid}/messages/`
            ,{message}
            ,{headers:{"Content-Type":"application/json",
                "Authorization":`Bearer ${localStorage.getItem("cookie")}`
            }}
        )
        console.log(`resp postMsg:${resp.data}`)
        return resp.data

    }catch(e:any){
        const error=e?.response?.data
        console.log(`Error in postMsg ${error}`)
    }

}

export {postMsg}