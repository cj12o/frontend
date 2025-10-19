//for messages
type Author={
    username:string,
    id:number
}


type Message={
    id:number,
    author:Author,
    room:string,
    images_msg:string,
    file_msg:string,
    message:string,
    vote:number,
    created_at:string,
    updated_at:string,
    parent:number,
}

//for memebers and other data
   
type Member={
    member_name:string,
    member_id:number,
    status:boolean
}
type Moderator={
    id:number,
    username:string,
    status:boolean
}
type Room={
    id:string,
    author:Author,
    parent_topic:string,
    members:Member [],
    moderator:Moderator []
    name:string,
    description:string,
    topic:string,
    is_private:boolean,
    created_at:string,
    updated_at:string,
    chidren:number []
}


type LastJsonMessage={
    type:string,
    message:string,
    username:string,
    status:boolean
}

export type {Room,Author,Message,Member,Moderator,LastJsonMessage}