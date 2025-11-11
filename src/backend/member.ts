import axios from "axios";

const addMember=async (roomid:number)=>{
    console.log(`Token ${localStorage.getItem("cookie")}`)
    try{
        const resp=await axios.patch(import.meta.env.VITE_MEMBER_EPT+`${roomid}/`
            ,{}
            ,{headers:{"Content-Type":"application/json",
                "Authorization":`Token ${localStorage.getItem("cookie")}`
            }}
        )
    }
    catch(e){
        
    }
}


const delMember=async (roomid:number)=>{
    console.log(`Token ${localStorage.getItem("cookie")}`)
    try{
        const resp=await axios.delete(import.meta.env.VITE_MEMBER_EPT+`${roomid}/`
            ,{headers:{"Content-Type":"application/json",
                "Authorization":`Token ${localStorage.getItem("cookie")}`
            }}
        )
    }
    catch(e){
    }
}

export {addMember,delMember}