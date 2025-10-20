// import React,{ Children, useEffect, useState } from "react";
// import {ArrowDownCircleIcon,ArrowUpCircleIcon,ArrowBigDown,ArrowBigUp,Send} from 'lucide-react';
// import { useParams } from "react-router-dom";
// import { getMsg } from '@/backend/message';
// import {WebSocketContext} from '../pages/WebSocketProvider';
// import { useContext } from "react";
// import { getVotes } from "@/backend/votes";


// function Message() {

//     type Comment={
//         id:number,
//         author:string,
//         message:string,
//         upvotes:number,
//         downvotes:number,
//         children: Comment []
//     }
//     type Vote={
//         message_id:number,
//         vote_type:number
//     }
//     const [comments, setComments] = useState<Comment []>([])
//     const [votes,setVotes]=useState<Vote []>([])
//     const [mainInput,setMainInput]=useState("")
//     // useEffect
//     const {sendMessage,lastJsonMessage}=useContext(WebSocketContext)

//    const {id}=useParams()

//     const getMessageData=async(id:number)=>{
//         try{
//             const resp=await getMsg(Number(id))
//             if(resp) setComments(resp?.messages)
//         }catch(e){

//         }
//     }
//     const getVotesData=async(id:number)=>{
//         try{
//             const resp=await getVotes(Number(id))
//             if(resp) setVotes(resp)
//         }catch(e){

//         }
//     }
//     useEffect(()=>{
//         try{
//             getMessageData(Number(id))
//             getVotesData(Number(id))
//         }
//         catch(e){  

//         }
//     },[])

//     useEffect(()=>{
        
//         if(!lastJsonMessage) return
//         if(lastJsonMessage.task==="chat"){
//             // console.log(`lastjson:${lastJsonMessage.message_id}`)
//             if(lastJsonMessage.parent){
//                 console.log("added to exisiting comment")
//                 setComments((prev)=>addReply(prev))
//             }
        
//             else{
//                 setComments((prev)=>([...prev,{id:lastJsonMessage.message_id,author:lastJsonMessage.author,message:lastJsonMessage.message,children:[],upvotes:0,downvotes:0}]))
//             }
//         }
//         else if(lastJsonMessage?.task==="vote" && lastJsonMessage.operation_done==true){
//             const voteType = lastJsonMessage.vote_type
//             const status = lastJsonMessage.status
//             const messageId = lastJsonMessage.message_id
//             const voteAuthor = lastJsonMessage.vote_author
//             const userName = localStorage.getItem("name") || ""
            
//             setComments((prev)=>updateVotes(prev,messageId,status,voteType))
            
//             if(voteAuthor===userName){
//                 if(voteType==="upvote"){
//                     if(status==="addVote"){
//                         setVotes((prev)=>([...prev,{message_id:messageId,vote_type:1}]))
//                     }
//                     else{
//                         setVotes((prev)=>(prev.filter((v)=>!(v.message_id===messageId && v.vote_type==voteType))))
//                     } 

//                 }
//                 if(voteType==="downvote"){
//                     if(status==="addVote"){
//                         setVotes((prev)=>([...prev,{message_id:messageId,vote_type:-1}]))
//                     }
//                     else{
//                         setVotes((prev)=>(prev.filter((v)=>!(v.message_id===messageId && v.vote_type==voteType))))
//                     } 
//                 }
//             }
//         }
//     },[lastJsonMessage])
  
//     const updateVotes=(comments:Comment [],message_id:number,status:string,vote_type:string):Comment []=>{
//         return comments.map((comment)=>{
//             if(comment.id===message_id && vote_type==="upvote"){
//                 console.log(`Status:${status}`)
//                 if(status==="addVote") return {...comment,upvotes:comment.upvotes+1}
//                 else return {...comment,upvotes:comment.upvotes-1}
//             }
//             else if(comment.id==message_id && vote_type==="downvote"){
//                 console.log(`Status:${status}`)
//                 if(status==="addVote") return {...comment,downvotes:comment.downvotes+1}
//                 else return {...comment,downvotes:comment.downvotes-1}
//             }
//             else return comment
//         })
//     }
//   const handleForm=(comment_id:Number,inputComment:string)=>{
//     console.log("Handle Form called")
//     const newReply={
//       message:inputComment,
//       parent: comment_id,
//     }
    
//     const rep:string=JSON.stringify(newReply)
//     sendMessage(rep)
//   }

//   const handleForm2=()=>{ //for main input
//     console.log("Handle Form called")
//     const newReply={
//       message:mainInput,
//       parent:null,
//     }
    
//     const rep:string=JSON.stringify(newReply)
//     sendMessage(rep)
//   }

//   const handleVote=(comment_id:number,type:string,status:string)=>{
//     const resp={
//         task:"vote",
//         status:status,
//         vote_type:type,//#up or down
//         message_id:comment_id,
//         vote_author:localStorage.getItem("name")||""
//     }
//     const send_resp=JSON.stringify(resp)
//     sendMessage(send_resp)
//   }
//     const addReply=(comments:Comment []):Comment []=>{

//         return comments.map((comment)=>{
//             if(comment.id==lastJsonMessage.parent){
//                 console.log(`lastJson:${lastJsonMessage}`)
//                 return {...comment,children:[...comment.children,{id:lastJsonMessage.message_id,author:lastJsonMessage.author,message:lastJsonMessage.message,children:[],upvotes:0,downvotes:0}]}
//             }
//             else if(comment.children.length>0){
//                 return {...comment,children:addReply(comment.children)}
//             }
//             else return comment
//         })
//     }
    

//   const RenderComment=React.memo(({comment,margin}:{comment:Comment,margin:number})=>{
    
//     const [inputComment,setInputComment]=useState("")
//     const [expanded,setExpanded]=useState(false)
//     const [inputBoxNeeded,setInputBoxNeeded]=useState(false)

    
//     const isUpvoted=votes.find((v)=>(v.message_id==comment.id && v.vote_type==1))
//     const isDownvoted=votes.find((v)=>(v.message_id==comment.id && v.vote_type==-1))
    
//     return (
//       <>
//       <div className="bg-white rounded m-2 border-2">
//       <div style={{ marginLeft: `${margin * 1}rem` }} >
//       <div className="flex rounded overflow-hidden">
      
//         {/* {votes btn} */}
//         <div className="grid pr-2 ">
//             <div className="flex">
//                 <div>
//                 <button onClick={()=>{
//                     isUpvoted?handleVote(comment.id,"upvote","subtractVote"):handleVote(comment.id,"upvote","addVote")
//                 }}>
                   
//                 {isUpvoted?<ArrowBigUp fill="orange" color="orange"/>:<ArrowBigUp/>}
//                 </button>
//                 </div>

//                 <div className="text-center">
//                     {comment.upvotes}
//                 </div>
//             </div>

//             <div className="flex">
//                 <div>
//                     <button onClick={()=>{
//                         isDownvoted?handleVote(comment.id,"downvote","subtractVote"):handleVote(comment.id,"downvote","addVote")
//                     }}>
//                     {isDownvoted?<ArrowBigDown fill="orange" color="orange"/>:<ArrowBigDown/>}
//                     </button>
//                 </div>
//                 <div className="text-center">
//                     {comment.downvotes}
//                 </div>
//             </div>
//         </div>

//         {/* {comment} */}
//         <div className="w-4/5 grid p-1">
//             <div className="p-1" id={String(comment.id)}>{comment.message}</div>   
//             {inputBoxNeeded?(
//             <form action="" className="flex" onSubmit={(e)=>{
//                 e.preventDefault()
//                 handleForm(comment.id,inputComment)
//                 setInputComment(""); 
//                 }}>
//                 <input type="" name="" id={String(comment.id)} placeholder="add comment.." className="border-1 rounded-l-md bg-white w-full"  value={inputComment}
//                 onChange={(e)=>{
//                     setInputComment(e.target.value)
//                     }}/>
//                 <button type="submit" className="bg-blue-300 rounded-r-md p-1">send</button>
//             </form>):null} 
//         </div>

//         {/* {to see child comments} */}
//         <div className="m-3">
//             <button style={{marginLeft:`${margin}rem`}} 
//                 onClick={()=>{
//                     setExpanded((prev)=>(!prev))
//                 }}
//             >

//             {comment.children.length>0?expanded?<ArrowUpCircleIcon/>:<ArrowDownCircleIcon/>:""}
//             </button>
//         </div>
//       {/* {to get comment box} */}
//       <button style={{marginLeft:`${margin}rem`}} 
//         onClick={()=>{
//           setInputBoxNeeded((prev)=>(!prev))
//         }}
//       >
//         {inputBoxNeeded?"-":"💬"}
//       </button>
//       </div>
//       </div>

//       {expanded && comment.children.length>0?
//             comment.children.map((rep)=>(
//                 <RenderComment comment={rep} margin={Number(Number(margin)+1)} key={rep.id}/>
//             )):null 
//       }
//       </div>
//       </>

//     )
//   })

//   return (
//   <>
//   <div className="flex flex-col h-full">
//     <div className="flex-1 overflow-y-auto p-4">
//     {
//         comments.map((c)=>{
//         return <RenderComment comment={c} margin={Number(1)} key={c.id}/>
//         })
    
//     }
//     </div>
//   <div className="p-6 bg-white rounded-md border border-indigo-500">
//         <div className="flex gap-3 max-w-4xl mx-auto">
//             <form action="" onSubmit={(e)=>{
//                     e.preventDefault()
//                     handleForm2()
//                 }} className="flex">
//                 <div>
//                 <input
//                 type="text"
//                 value={mainInput}
//                 onChange={(e) =>{
//                     e.preventDefault()
//                     setMainInput(e.target.value)
//                 }}
//                 placeholder="Type your message..."
//                 className="flex-1 px-6 py-3 rounded-full border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none transition-colors duration-200 bg-white"
//                 />
//                 </div>
                
//                 <div>
//                 <button
//                 type='submit'
//                 className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
//                 >
//                     <span>Send</span>
//                     <Send className="w-4 h-4" />
//                 </button>
//                 </div>
//             </form>      
//         </div>
//     </div>
//     </div>
//   </>
//   )
// }

// export default Message

import React, { Children, useEffect, useState, useCallback, createContext, useContext } from "react";
import { ArrowDownCircleIcon, ArrowUpCircleIcon, ArrowBigDown, ArrowBigUp, Send } from 'lucide-react';
import { useParams } from "react-router-dom";
import { getMsg } from '@/backend/message';
import { WebSocketContext } from '../pages/WebSocketProvider';
import { getVotes } from "@/backend/votes";

const ExpandedContext = createContext<{
  getExpanded: (id: number) => boolean;
  toggleExpand: (id: number) => void;
} | null>(null);

function Message() {
    type Comment = {
        id: number,
        author: string,
        message: string,
        upvotes: number,
        downvotes: number,
        children: Comment[]
    }
    type Vote = {
        message_id: number,
        vote_type: number
    }
    const [comments, setComments] = useState<Comment[]>([])
    const [votes, setVotes] = useState<Vote[]>([])
    const [mainInput, setMainInput] = useState("")
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})
    // useEffect
    const { sendMessage, lastJsonMessage } = useContext(WebSocketContext)

    const { id } = useParams()

    const getMessageData = async (id: number) => {
        try {
            const resp = await getMsg(Number(id))
            if (resp) setComments(resp?.messages || [])
        } catch (e) {
            console.error(e)
        }
    }
    const getVotesData = async (id: number) => {
        try {
            const resp = await getVotes(Number(id))
            if (resp) setVotes(resp || [])
        } catch (e) {
            console.error(e)
        }
    }
    useEffect(() => {
        try {
            getMessageData(Number(id))
            getVotesData(Number(id))
        } catch (e) {
            console.error(e)
        }
    }, [id])

    const getExpanded = useCallback((commentId: number) => expandedComments[commentId] ?? false, [expandedComments])
    const toggleExpand = useCallback((commentId: number) => {
        setExpandedComments(prev => ({ ...prev, [commentId]: !(prev[commentId] ?? false) }))
    }, [])

    useEffect(() => {

        if (!lastJsonMessage) return
        if (lastJsonMessage.task === "chat") {
            // console.log(`lastjson:${lastJsonMessage.message_id}`)
            if (lastJsonMessage.parent) {
                console.log("added to exisiting comment")
                setComments((prev) => addReply(prev))
            }

            else {
                setComments((prev) => ([...prev, { id: lastJsonMessage.message_id, author: lastJsonMessage.author, message: lastJsonMessage.message, children: [], upvotes: 0, downvotes: 0 }]))
            }
        }
        else if (lastJsonMessage?.task === "vote" && lastJsonMessage.operation_done == true) {
            const voteType = lastJsonMessage.vote_type
            const status = lastJsonMessage.status
            const messageId = lastJsonMessage.message_id
            const voteAuthor = lastJsonMessage.vote_author
            const userName = localStorage.getItem("name") || ""

            setComments((prev) => updateVotes(prev, messageId, status, voteType))

            if (voteAuthor === userName) {
                const voteTypeNum = voteType === "upvote" ? 1 : -1
                if (status === "addVote") {
                    setVotes((prev) => ([...prev, { message_id: messageId, vote_type: voteTypeNum }]))
                } else {
                    setVotes((prev) => (prev.filter((v) => !(v.message_id === messageId && v.vote_type === voteTypeNum))))
                }
            }
        }
    }, [lastJsonMessage])

    const updateVotes = (comments: Comment[], message_id: number, status: string, vote_type: string): Comment[] => {
        return comments.map((comment) => {
            let updatedComment = comment
            if (comment.id === message_id) {
                if (vote_type === "upvote") {
                    console.log(`Status:${status}`)
                    if (status === "addVote") updatedComment = { ...comment, upvotes: comment.upvotes + 1 }
                    else updatedComment = { ...comment, upvotes: comment.upvotes - 1 }
                } else if (vote_type === "downvote") {
                    console.log(`Status:${status}`)
                    if (status === "addVote") updatedComment = { ...comment, downvotes: comment.downvotes + 1 }
                    else updatedComment = { ...comment, downvotes: comment.downvotes - 1 }
                }
            }
            if (comment.children.length > 0) {
                return { ...updatedComment, children: updateVotes(comment.children, message_id, status, vote_type) }
            }
            return updatedComment
        })
    }
    const handleForm = (comment_id: number, inputComment: string) => {
        console.log("Handle Form called")
        const newReply = {
            message: inputComment,
            parent: comment_id,
        }

        const rep: string = JSON.stringify(newReply)
        sendMessage(rep)
    }

    const handleForm2 = () => { //for main input
        console.log("Handle Form called")
        const newReply = {
            message: mainInput,
            parent: null,
        }

        const rep: string = JSON.stringify(newReply)
        sendMessage(rep)
        setMainInput("")
    }

    const handleVote = (comment_id: number, type: string, status: string) => {
        const resp = {
            task: "vote",
            status: status,
            vote_type: type, //#up or down
            message_id: comment_id,
            vote_author: localStorage.getItem("name") || ""
        }
        const send_resp = JSON.stringify(resp)
        sendMessage(send_resp)
    }
    const addReply = (comments: Comment[]): Comment[] => {

        return comments.map((comment) => {
            if (comment.id == lastJsonMessage!.parent) {
                console.log(`lastJson:${lastJsonMessage}`)
                return { ...comment, children: [...comment.children, { id: lastJsonMessage!.message_id, author: lastJsonMessage!.author, message: lastJsonMessage!.message, children: [], upvotes: 0, downvotes: 0 }] }
            }
            else if (comment.children.length > 0) {
                return { ...comment, children: addReply(comment.children) }
            }
            else return comment
        })
    }


    const RenderComment = React.memo(({ comment, margin }: { comment: Comment, margin: number }) => {
        const context = useContext(ExpandedContext)
        if (!context) {
            throw new Error("ExpandedContext must be used within a Message component")
        }
        const { getExpanded, toggleExpand } = context

        const [inputComment, setInputComment] = useState("")
        const [inputBoxNeeded, setInputBoxNeeded] = useState(false)

        const expanded = getExpanded(comment.id)
        const isUpvoted = votes.find((v) => (v.message_id == comment.id && v.vote_type == 1))
        const isDownvoted = votes.find((v) => (v.message_id == comment.id && v.vote_type == -1))

        return (
            <>
                <div className="bg-white rounded m-2 border-2">
                    <div style={{ marginLeft: `${margin * 1}rem` }}>
                        <div className="flex rounded overflow-hidden">

                            {/* {votes btn} */}
                            <div className="grid pr-2">
                                <div className="flex">
                                    <div>
                                        <button onClick={() => {
                                            isUpvoted ? handleVote(comment.id, "upvote", "subtractVote") : handleVote(comment.id, "upvote", "addVote")
                                        }}>

                                            {isUpvoted ? <ArrowBigUp fill="orange" color="orange" /> : <ArrowBigUp />}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        {comment.upvotes}
                                    </div>
                                </div>

                                <div className="flex">
                                    <div>
                                        <button onClick={() => {
                                            isDownvoted ? handleVote(comment.id, "downvote", "subtractVote") : handleVote(comment.id, "downvote", "addVote")
                                        }}>
                                            {isDownvoted ? <ArrowBigDown fill="orange" color="orange" /> : <ArrowBigDown />}
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
                                {inputBoxNeeded ? (
                                    <form action="" className="flex" onSubmit={(e) => {
                                        e.preventDefault()
                                        handleForm(comment.id, inputComment)
                                        setInputComment("");
                                        setInputBoxNeeded(false);
                                    }}>
                                        <input type="text" name="" id={String(comment.id)} placeholder="add comment.." className="border-1 rounded-l-md bg-white w-full" value={inputComment}
                                            onChange={(e) => {
                                                setInputComment(e.target.value)
                                            }} />
                                        <button type="submit" className="bg-blue-300 rounded-r-md p-1">send</button>
                                    </form>) : null}
                            </div>

                            {/* {to see child comments} */}
                            <div className="m-3">
                                <button style={{ marginLeft: `${margin}rem` }}
                                    onClick={() => {
                                        toggleExpand(comment.id)
                                    }}
                                >

                                    {comment.children.length > 0 ? expanded ? <ArrowUpCircleIcon /> : <ArrowDownCircleIcon /> : ""}
                                </button>
                            </div>
                            {/* {to get comment box} */}
                            <button style={{ marginLeft: `${margin}rem` }}
                                onClick={() => {
                                    setInputBoxNeeded((prev) => (!prev))
                                }}
                            >
                                {inputBoxNeeded ? "-" : "💬"}
                            </button>
                        </div>
                    </div>

                    {expanded && comment.children.length > 0 ?
                        comment.children.map((rep) => (
                            <RenderComment comment={rep} margin={Number(Number(margin) + 1)} key={rep.id} />
                        )) : null
                    }
                </div>
            </>
        )
    })

    return (
        <>
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4">
                    <ExpandedContext.Provider value={{ getExpanded, toggleExpand }}>
                        {
                            comments.map((c) => {
                                return <RenderComment comment={c} margin={Number(1)} key={c.id} />
                            })
                        }
                    </ExpandedContext.Provider>
                </div>
                <div className="p-6 bg-white rounded-md border border-indigo-500">
                    <div className="flex gap-3 max-w-4xl mx-auto">
                        <form action="" onSubmit={(e) => {
                            e.preventDefault()
                            handleForm2()
                        }} className="flex">
                            <div>
                                <input
                                    type="text"
                                    value={mainInput}
                                    onChange={(e) => {
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
