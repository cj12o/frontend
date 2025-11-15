import axios from "axios";



const getRoomdetail=async(room_id:number)=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_ROOM_EPT+`?id=${room_id}`)
        return resp?.data[0]
    }catch(e){

    }
}

const createRoom=async(room_name:string,room_description:string,room_topic:string,is_private:boolean,tagsss:string [],moderator_list:string[])=>{
    try{
        const data={   
            name:room_name,
            description:room_description,
            topic:room_topic,
            is_private:is_private,
            tags:{tags:tagsss},
            moderator:moderator_list
        }

    
        const resp=await axios.post(import.meta.env.VITE_ROOM_EPT,
            data
            ,{
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization":`Token ${localStorage.getItem("cookie")}`
                },
            }
        )
        return resp.status
    }catch(e){
        console.error(e);
        return 400        
    }
}

export {getRoomdetail,createRoom}


