import axios from "axios";

const getPolls=async(message_id:number)=>{
    // const room_id=1
    try{
        const res=await axios.get(import.meta.env.VITE_POLLS_EPT+`${message_id}/`,
            {
                headers:{
                    "Content-Type":"application/json"
                }
            }
        )
        
        console.log(`POLL DATA ${res.data?.poll[0].author}`)
        return res.data?.poll[0]
    }
    catch(e){
        console.log(`Error in getPolls ,message id:${message_id}`)   
    }
}

export {getPolls}