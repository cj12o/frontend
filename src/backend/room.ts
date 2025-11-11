import axios from "axios";


const getRoomdetail=async(room_id:number)=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_ROOM_EPT+`?id=${room_id}`)
        return resp?.data[0]
    }catch(e){

    }
}
export {getRoomdetail}


