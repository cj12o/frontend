import axios from "axios";


// for update room 
// is_private
// 1->true
// 0->false
// -1->no value

const getRoomdetail=async(room_id:number)=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_ROOM_EPT+`?id=${room_id}`)
        return resp?.data[0]
    }catch(e){
        console.error(e);
    }
}

const createRoom=async(room_name:string,room_description:string,room_topic:string,is_private:boolean,tagsss:string [],moderator_list:number[])=>{
    try{
        const data={   
            name:room_name,
            description:room_description,
            topic:room_topic,
            is_private:is_private,
            tags:tagsss,
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


const updateRoom=async(room_id:number,room_name:string="",room_description:string="",room_topic:string="",is_private:number=-1,tagsss:string []=[],moderator_list:number[]=[],parent_topic_id:number=-1)=>{
    
    try{   
        const bool_mapper=[false,true]

        const data:{id:number,name?:string,description?:string,topic?:string,is_private?:boolean,tags?:string[],moderator?:number[],parent_topic_id?:number}={
            id:room_id
        }

        if(room_name) data.name=room_name
        if(room_description) data.description=room_description
        if(room_topic) data.topic=room_topic
        if(is_private>-1) data.is_private=bool_mapper[is_private]
        if(tagsss.length>0) data.tags=tagsss
        if(moderator_list.length>0) data.moderator=moderator_list
        if(parent_topic_id>-1) data.parent_topic_id=parent_topic_id
        

        const resp=await axios.patch(import.meta.env.VITE_ROOM_EPT,
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

export {getRoomdetail,createRoom,updateRoom}


