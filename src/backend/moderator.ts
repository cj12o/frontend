import axios from "axios";

const getRoomsList=async()=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_MODERATOR_EPT+`mod_room_lst/`
            ,{
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Token ${localStorage.getItem("cookie")}`
                }
            }
        )
        return resp?.data
    }catch(e:any){
        console.log(`error ${e}`)
    }
}

const getMessageList=async(room_id:number)=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_MODERATOR_EPT+`messages/${room_id}/`
            ,{
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Token ${localStorage.getItem("cookie")}`
                }
            }
        )
        return resp?.data
    }catch(e:any){
        console.log(`error ${e}`)
    }
}

const sendMessageList=async(room_id:number,no_action_needed:number[]=[],action_needed:number[]=[])=>{
    try{
        const resp=await axios.post(import.meta.env.VITE_MODERATOR_EPT+`messages/${room_id}/`
            ,{
                no_action_needed:no_action_needed,
                action_needed:action_needed
            }
            ,{
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Token ${localStorage.getItem("cookie")}`
                }
            }
        )
        return resp?.status
    }catch(e:any){
        console.log(`error ${e}`)
    }
}


export {getRoomsList,getMessageList,sendMessageList}