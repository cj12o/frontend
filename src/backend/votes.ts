import axios from "axios";

const getVotes=async (roomid:number)=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_BASE_EPT+`votes/${roomid}`
            ,{headers:{"Content-Type":"application/json",
                "Authorization":`Token ${localStorage.getItem("cookie")}`
            }}
        )
        return resp.data?.votes
    }
    catch(e){

    }
}

export {getVotes}