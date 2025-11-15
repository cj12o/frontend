import axios from "axios";

const postMsg=async (roomid:number,message:string,file:File|null,image:File|null)=>{
    try{
        const data=new FormData()
        data.append("message",message)
        if(file) data.append("file",file)
        if(image) data.append("image",image)

        const resp=await axios.post(import.meta.env.VITE_BASE_EPT+`rooms/${roomid}/messages/`
            ,data
            ,{headers:{
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



const deleteMsg=async (roomid:number,message_id:number)=>{
    try{
        const data={id:roomid}
        const resp=await axios.delete(import.meta.env.VITE_BASE_EPT+`rooms/${roomid}/messages/?id=${message_id}`
            ,{headers:{
                "Authorization":`Token ${localStorage.getItem("cookie")}`
            }}
        )
        console.log(`resp postMsg:${resp.data}`)
        return resp.status

    }catch(e:any){
        const error=e?.response?.data
        console.log(`Error in postMsg ${error}`)
    }

}


export {postMsg,getMsg,deleteMsg}

