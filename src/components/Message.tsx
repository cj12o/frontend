import { Children, useEffect, useState } from "react";
import {ArrowDownCircleIcon,ArrowUpCircleIcon,ArrowBigDown,ArrowBigUp,Send} from 'lucide-react';
import { useParams } from "react-router-dom";
import { getMsg } from '@/backend/message';
import {WebSocketContext} from '../pages/WebSocketProvider';
import { useContext } from "react";



function Message() {

    type Comment={
        id:number,
        author:string,
        message:string,
        upvotes:number,
        downvotes:number,
        children: Comment []
    }
    
    const [comments, setComments] = useState<Comment []>([])
    const [mainInput,setMainInput]=useState("")
    // useEffect
    const {sendMessage,lastJsonMessage}=useContext(WebSocketContext)

   const {id}=useParams()

    const getMessageData=async(id:number)=>{
        try{
            const resp=await getMsg(Number(id))
            setComments(resp?.messages)
        }catch(e){

        }
    }
    useEffect(()=>{
        getMessageData(Number(id))
    },[])

  
  useEffect(()=>{
    if(!lastJsonMessage || lastJsonMessage.message==="user_status_update") return 
    
    if(lastJsonMessage.parent){
        console.log("added to exisiting comment")
        setComments((prev)=>addReply(prev))
    }
    
    else{
        setComments((prev)=>([...prev,{id:lastJsonMessage.id,author:lastJsonMessage.author,message:lastJsonMessage.message,children:[],upvotes:0,downvotes:0}]))
    }

  },[lastJsonMessage])

  const handleForm=(comment_id:Number,inputComment:string)=>{
    console.log("Handle Form called")
    const newReply={
      message:inputComment,
      parent: comment_id,
    }
    
    const rep:string=JSON.stringify(newReply)
    sendMessage(rep)
  }

  const handleForm2=()=>{ //for main input
    console.log("Handle Form called")
    const newReply={
      message:mainInput,
      parent:null,
    }
    
    const rep:string=JSON.stringify(newReply)
    sendMessage(rep)
  }

    const addReply=(comments:Comment []):Comment []=>{

        return comments.map((comment)=>{
            if(comment.id==lastJsonMessage.parent){
                console.log(`lastJson:${lastJsonMessage.message}`)
                return {...comment,children:[...comment.children,{id:lastJsonMessage.id,author:lastJsonMessage.author,message:lastJsonMessage.message,children:[],upvotes:0,downvotes:0}]}
            }
            else if(comment.children.length>0){
                return {...comment,children:addReply(comment.children)}
            }
            else return comment
        })
    }


    

  const RenderComment=({comment,margin}:{comment:Comment,margin:number})=>{
    const [inputComment,setInputComment]=useState("")
    const [expanded,setExpanded]=useState(false)
    const [inputBoxNeeded,setInputBoxNeeded]=useState(false)
    const [downvote,setDownVote]=useState(false)
    const [upvote,setUpVote]=useState(false)
    return (
      <>
      <div className="bg-white rounded m-2 border-2">
      <div style={{ marginLeft: `${margin * 1}rem` }} >
      <div className="flex rounded overflow-hidden">
      
        {/* {votes btn} */}
        <div className="grid pr-2 ">
            <div className="flex">
                <div>
                <button onClick={()=>{
                    setUpVote((prev)=>(!prev))
                    setDownVote(false)
                    // handleVote()   //Todo
                }}>
                {upvote && !downvote?<ArrowBigUp fill="orange" color="orange"/>:<ArrowBigUp/>}
                </button>
                </div>

                <div className="text-center">
                    {comment.upvotes}
                </div>
            </div>

            <div className="flex">
                <div>
                    <button onClick={()=>{
                    setDownVote((prev)=>(!prev))
                    setUpVote(false)
                }}>
                {downvote && !upvote?<ArrowBigDown fill="orange" color="orange"/>:<ArrowBigDown/>}
            </button>
                </div>
                <div className="text-center">
                    {comment.downvotes}
                </div>
            </div>
        </div>

        {/* {comment} */}
        <div className="w-4/5 grid p-1">
            <div className="p-1" id={String(comment.id)}>{comment.message}</div>   
            {inputBoxNeeded?(
            <form action="" className="flex" onSubmit={(e)=>{
                e.preventDefault()
                handleForm(comment.id,inputComment)
                setInputComment(""); 
                }}>
                <input type="" name="" id={String(comment.id)} placeholder="add comment.." className="border-1 rounded-l-md bg-white w-full"  value={inputComment}
                onChange={(e)=>{
                    setInputComment(e.target.value)
                    }}/>
                <button type="submit" className="bg-blue-300 rounded-r-md p-1">send</button>
            </form>):null} 
        </div>

        {/* {to see child comments} */}
        <div className="m-3">
            <button style={{marginLeft:`${margin}rem`}} 
                onClick={()=>{
                    setExpanded((prev)=>(!prev))
                }}
            >

            {comment.children.length>0?expanded?<ArrowUpCircleIcon/>:<ArrowDownCircleIcon/>:""}
            </button>
        </div>
      {/* {to get comment box} */}
      <button style={{marginLeft:`${margin}rem`}} 
        onClick={()=>{
          setInputBoxNeeded((prev)=>(!prev))
        }}
      >
        {inputBoxNeeded?"-":"💬"}
      </button>
      </div>
      </div>

      {expanded && comment.children.length>0?
            comment.children.map((rep)=>(
                <RenderComment comment={rep} margin={Number(Number(margin)+1)}/>
            )):null 
      }
      </div>
      </>

    )
  }

  return (
  <>
  <div className="flex flex-col h-full">
    <div className="flex-1 overflow-y-auto p-4">
    {
        comments.map((c)=>{
        return <RenderComment comment={c} margin={Number(1)}/>
        })
    
    }
    </div>
  <div className="p-6 bg-white rounded-md border border-indigo-500">
        <div className="flex gap-3 max-w-4xl mx-auto">
            <form action="" onSubmit={(e)=>{
                    e.preventDefault()
                    handleForm2()
                }} className="flex">
                <div>
                <input
                type="text"
                value={mainInput}
                onChange={(e) =>{
                    e.preventDefault()
                    setMainInput(e.target.value)
                }}
                placeholder="Type your message..."
                className="flex-1 px-6 py-3 rounded-full border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none transition-colors duration-200 bg-white"
                />
                </div>
                
                <div>
                <button
                type='submit'
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                >
                    <span>Send</span>
                    <Send className="w-4 h-4" />
                </button>
                </div>
            </form>      
        </div>
    </div>
    </div>
  </>
  )
}

export default Message


