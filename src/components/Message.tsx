// import React, { Children, useEffect, useState, useCallback, createContext, useContext } from "react";
// import { ArrowDownCircleIcon, ArrowUpCircleIcon, ArrowBigDown, ArrowBigUp, Send } from 'lucide-react';
// import { useParams } from "react-router-dom";
// import { getMsg } from '@/backend/message';
// import { WebSocketContext } from '../pages/WebSocketProvider';
// import { getVotes } from "@/backend/votes";
// import {Link} from "react-router-dom"
// import PollComponents from "./Poll";

// const ExpandedContext = createContext<{
//   getExpanded: (id: number) => boolean;
//   toggleExpand: (id: number) => void;
// } | null>(null);

// const PollComp=React.memo(({id}:{id:number})=>{
//     return <PollComponents id={id}/>
// })

// function Message() {
//     type Comment = {
//         id: number,
//         author:string,
//         message: string,
//         upvotes: number,
//         downvotes: number,
//         children: Comment[],
//         hasPoll:boolean
//     }
//     type Vote = {
//         message_id: number,
//         vote_type: number
//     }
//     const [comments, setComments] = useState<Comment[]>([])
//     const [votes, setVotes] = useState<Vote[]>([])
//     const [mainInput, setMainInput] = useState("")
//     const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})
    
//     const { sendMessage, lastJsonMessage } = useContext(WebSocketContext)

//     const { id } = useParams()

//     const getMessageData = async (id: number) => {
//         try {
//             const resp = await getMsg(Number(id))
//             if (resp) setComments(resp?.messages || [])
//         } catch (e) {
//             console.error(e)
//         }
//     }
//     const getVotesData = async (id: number) => {
//         try {
//             const resp = await getVotes(Number(id))
//             if (resp) setVotes(resp || [])
//         } catch (e) {
//             console.error(e)
//         }
//     }

    
//     useEffect(() => {
//         try {
//             getMessageData(Number(id))
//             getVotesData(Number(id))
//         } catch (e) {
//             console.error(e)
//         }
//     }, [id])

//     const getExpanded = useCallback((commentId: number) => expandedComments[commentId] ?? false, [expandedComments])
//     const toggleExpand = useCallback((commentId: number) => {
//         setExpandedComments(prev => ({ ...prev, [commentId]: !(prev[commentId] ?? false) }))
//     }, [])

//     useEffect(() => {

//         if (!lastJsonMessage) return
//         console.log(`Agent task:${lastJsonMessage.task}`)
//         if (lastJsonMessage.task === "chat") {
//             if (lastJsonMessage.parent) {
//                 console.log("added to exisiting comment")
//                 setComments((prev) => addReply(prev))
//             }
//             else {
//                 setComments((prev) => ([...prev, { id: lastJsonMessage.message_id, author: lastJsonMessage.username, message: lastJsonMessage.message, children: [], upvotes: 0, downvotes: 0 ,hasPoll:false}]))
//             }
//         }
//         else if (lastJsonMessage?.task === "vote" && lastJsonMessage.operation_done == true) {
//             const voteType = lastJsonMessage.vote_type
//             const status = lastJsonMessage.status
//             const messageId = lastJsonMessage.message_id
//             const voteAuthor = lastJsonMessage.vote_author
//             const userName = localStorage.getItem("name") || ""

//             setComments((prev) => updateVotes(prev, messageId, status, voteType))

//             if (voteAuthor === userName) {
//                 const voteTypeNum = voteType === "upvote" ? 1 : -1
//                 if (status === "addVote") {
//                     setVotes((prev) => ([...prev, { message_id: messageId, vote_type: voteTypeNum }]))
//                 } else {
//                     setVotes((prev) => (prev.filter((v) => !(v.message_id === messageId && v.vote_type === voteTypeNum))))
//                 }
//             }
//         }
//         else if (lastJsonMessage.task === "AgentActivity" && lastJsonMessage.tool_called === "pollGenerator") {
//             console.log("Poll received from AgentActivity");

//             // You could either create a new comment for the poll...
//             setComments((prev) => [
//             ...prev,
//             {
//                 id: lastJsonMessage.message_id,
//                 author: lastJsonMessage.username,
//                 message: lastJsonMessage.question, // show question as the text
//                 children: [],
//                 upvotes: 0,
//                 downvotes: 0,
//                 hasPoll: true, 
//             },
//             ]);
//         }
//     }, [lastJsonMessage])

    
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
//             if(comment.children.length>0){
//                 return {...comment,children:updateVotes(comment.children,message_id,status,vote_type)}
//             }
//             else return comment
//         })
//     }
//     const handleForm = (comment_id: number, inputComment: string) => {
//         console.log("Handle Form called")
//         const newReply = {
//             message: inputComment,
//             parent: comment_id,
//         }

//         const rep: string = JSON.stringify(newReply)
//         sendMessage(rep)
//     }

//     const handleForm2 = () => {
//         console.log("Handle Form called")
//         const newReply = {
//             message: mainInput,
//             parent: null,
//         }

//         const rep: string = JSON.stringify(newReply)
//         sendMessage(rep)
//         setMainInput("")
//     }

//     const handleVote = (comment_id: number, type: string, status: string) => {
//         const resp = {
//             task: "vote",
//             status: status,
//             vote_type: type,
//             message_id: comment_id,
//             vote_author: localStorage.getItem("name") || ""
//         }
//         const send_resp = JSON.stringify(resp)
//         sendMessage(send_resp)
//     }
//     const addReply = (comments: Comment[]): Comment[] => {

//         return comments.map((comment) => {
//             if (comment.id == lastJsonMessage?.parent) {
//                 console.log(`lastJson:${lastJsonMessage}`)
//                 return { ...comment, children: [...comment.children, { id: lastJsonMessage?.message_id, author: lastJsonMessage?.username, message: lastJsonMessage?.message, children: [], upvotes: 0, downvotes: 0,hasPoll:false}] }
//             }
//             else if (comment.children.length > 0) {
//                 return { ...comment, children: addReply(comment.children) }
//             }
//             else return comment
//         })
//     }
   

//     const RenderComment = React.memo(({ comment, margin }: { comment: Comment, margin: number }) => {
//         const context = useContext(ExpandedContext)
//         if (!context) {
//             throw new Error("ExpandedContext must be used within a Message component")
//         }
//         const { getExpanded, toggleExpand } = context

//         const [inputComment, setInputComment] = useState("")
//         const [inputBoxNeeded, setInputBoxNeeded] = useState(false)

//         const expanded = getExpanded(comment.id)
//         const isUpvoted = votes.find((v) => (v.message_id == comment.id && v.vote_type == 1))
//         const isDownvoted = votes.find((v) => (v.message_id == comment.id && v.vote_type == -1))

//         return (
//             <>
//                 {comment.hasPoll ?<div className="mt-1"><PollComp id={Number(comment.id)}/></div>:
//                 <div className="bg-white rounded-lg mb-2 border border-gray-200 shadow-sm">
//                     <div className="flex items-start p-3 gap-3">

//                             {/* Votes section */}
//                             <div className="flex flex-col items-center gap-1 min-w-[60px]">
//                                 <div className="flex">
//                                     <button 
//                                         onClick={() => {
//                                             isUpvoted ? handleVote(comment.id, "upvote", "subtractVote") : handleVote(comment.id, "upvote", "addVote")
//                                         }}
//                                         className="hover:bg-gray-100 rounded p-1 transition-colors"
//                                     >
//                                         {isUpvoted ? <ArrowBigUp fill="orange" color="orange" /> : <ArrowBigUp />}
//                                     </button>
                                    
//                                     <span className="text-sm font-semibold">
//                                         {comment.upvotes}
//                                     </span>
//                                 </div>
                                
//                                 <div className="flex">
//                                     <button 
//                                         onClick={() => {
//                                             isDownvoted ? handleVote(comment.id, "downvote", "subtractVote") : handleVote(comment.id, "downvote", "addVote")
//                                         }}
//                                         className="hover:bg-gray-100 rounded p-1 transition-colors"
//                                     >
//                                         {isDownvoted ? <ArrowBigDown fill="orange" color="orange" /> : <ArrowBigDown />}
//                                     </button>
                                    
//                                     <span className="text-sm font-semibold">
//                                         {comment.downvotes}
//                                 </span>
//                                 </div>
                                
//                             </div>

//                             {/* Comment content */}
//                             <div className="flex-1 min-w-0">
//                                 <div className="mb-2">
//                                     <Link 
//                                         to={`/profile/${comment.author}`}
//                                         className="text-sm font-medium text-blue-600 hover:text-orange-500 transition-colors"
//                                     >
//                                         {comment.author}
//                                     </Link>
//                                 </div>
//                                 <div className="text-gray-800 break-words">
//                                     {comment.message}
//                                 </div>
                                
//                                 {inputBoxNeeded && (
//                                     <form 
//                                         onSubmit={(e) => {
//                                             e.preventDefault()
//                                             handleForm(comment.id, inputComment)
//                                             setInputComment("");
//                                             setInputBoxNeeded(false);
//                                         }}
//                                         className="mt-3"
//                                     >
//                                         <div className="flex gap-2">
//                                             <input 
//                                                 type="text" 
//                                                 placeholder="Add a reply..." 
//                                                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
//                                                 value={inputComment}
//                                                 onChange={(e) => setInputComment(e.target.value)} 
//                                             />
//                                             <button 
//                                                 type="submit" 
//                                                 className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
//                                             >
//                                                 Send
//                                             </button>
//                                         </div>
//                                     </form>
//                                 )}
//                             </div>

//                             {/* Action buttons */}
//                             <div className="flex items-center gap-2">
//                                 {comment.children.length > 0 && (
//                                     <button
//                                         onClick={() => toggleExpand(comment.id)}
//                                         className="hover:bg-gray-100 rounded p-1 transition-colors"
//                                         title={expanded ? "Collapse replies" : "Expand replies"}
//                                     >
//                                         {expanded ? <ArrowUpCircleIcon size={20} /> : <ArrowDownCircleIcon size={20} />}
//                                     </button>
//                                 )}
                                
//                                 <button
//                                     onClick={() => setInputBoxNeeded((prev) => !prev)}
//                                     className="hover:bg-gray-100 rounded px-2 py-1 transition-colors text-lg"
//                                     title="Reply"
//                                 >
//                                     {inputBoxNeeded ? "✕" : "💬"}
//                                 </button>
//                             </div>
//                         </div>

//                     {expanded && comment.children.length > 0 && (
//                         <div className="ml-12 pl-4 border-l-2 border-gray-300">
//                             {comment.children.map((rep) => (
//                                 <RenderComment comment={rep} margin={margin} key={rep.id} />
//                             ))}
//                         </div>
//                     )}
//                 </div>}
//             </>
//         )
//     })

//     return (
//         <div className="flex flex-col h-screen bg-gray-50">
//             <div className="flex-1 overflow-y-auto p-4 pb-24">
//                 <ExpandedContext.Provider value={{ getExpanded, toggleExpand }}>
//                     <div className="max-w-4xl mx-auto">
//                         {comments.map((c) => (
//                             <RenderComment comment={c} margin={1} key={c.id} />
//                         ))}
//                     </div>
//                 </ExpandedContext.Provider>
//             </div>
            
//             <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
//                 <form 
//                     onSubmit={(e) => {
//                         e.preventDefault()
//                         handleForm2()
//                     }} 
//                     className="max-w-4xl mx-auto"
//                 >
//                     <div className="flex gap-3">
//                         <input
//                             type="text"
//                             value={mainInput}
//                             onChange={(e) =>{
//                                 e.preventDefault()
//                                 setMainInput(e.target.value)
//                             }}
//                             placeholder="Type your message..."
//                             className="flex-1 px-6 py-3 rounded-full border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none transition-colors duration-200 bg-white"
//                         />
//                         <button
//                             type="submit"
//                             className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium whitespace-nowrap"
//                         >
//                             <span>Send</span>
//                             <Send className="w-4 h-4" />
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Message
    

import React, { Children, useEffect, useState, useCallback, createContext, useContext } from "react";
import { ArrowDownCircleIcon, ArrowUpCircleIcon, ArrowBigDown, ArrowBigUp, Send } from 'lucide-react';
import { useParams } from "react-router-dom";
import { getMsg } from '@/backend/message';
import { WebSocketContext } from '../pages/WebSocketProvider';
import { getVotes } from "@/backend/votes";
import {Link} from "react-router-dom"
import PollComponents from "./Poll";

const ExpandedContext = createContext<{
  getExpanded: (id: number) => boolean;
  toggleExpand: (id: number) => void;
} | null>(null);

const PollComp=React.memo(({id}:{id:number})=>{
    return <PollComponents id={id}/>
})

function Message() {
        // {
        //     "id": 547,
        //     "author": "chitransh",
        //     "room": "Messi The messia",
        //     "message": "wfrff",
        //     "images_msg": null,
        //     "file_msg": null,
        //     "parent": null,
        //     "upvotes": 0,
        //     "downvotes": 0,
        //     "children": [],
        //     "hasPoll": false
        // },
    type Comment = {
        id: number,
        author:string,
        message: string,
        images_msg:string,
        file_msg:string,
        upvotes: number,
        downvotes: number,
        children: Comment[],
        hasPoll:boolean
    }
    type Vote = {
        message_id: number,
        vote_type: number
    }
    const [comments, setComments] = useState<Comment[]>([])
    const [votes, setVotes] = useState<Vote[]>([])
    // const [mainInput, setMainInput] = useState("")
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})
    
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
        console.log(`Agent task:${lastJsonMessage.task}`)
        if (lastJsonMessage.task === "chat" || ( lastJsonMessage.task==="AgentActivity" && lastJsonMessage.tool_called=="threadGenerator")) {
            if (lastJsonMessage.parent) {
                console.log("added to exisiting comment")
                setComments((prev) => addReply(prev))
            }
            else {
                setComments((prev) => ([...prev, { id: lastJsonMessage.message_id, author: lastJsonMessage.username, message: lastJsonMessage.message,images_msg:lastJsonMessage.image_url,file_msg:lastJsonMessage.file_url,children: [], upvotes: 0, downvotes: 0 ,hasPoll:false}]))
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
        else if (lastJsonMessage.task === "AgentActivity" && lastJsonMessage.tool_called === "pollGenerator") {
            console.log("Poll received from AgentActivity");

            // You could either create a new comment for the poll...
            setComments((prev) => [
            ...prev,
            {
                id: lastJsonMessage.message_id,
                author: lastJsonMessage.username,
                message: lastJsonMessage.question, // show question as the text"
                images_msg:"",
                file_msg:"",
                children: [],
                upvotes: 0,
                downvotes: 0,
                hasPoll: true, 
            },
            ]);
        }
    }, [lastJsonMessage])

    
    const updateVotes=(comments:Comment [],message_id:number,status:string,vote_type:string):Comment []=>{
        return comments.map((comment)=>{
            if(comment.id===message_id && vote_type==="upvote"){
                console.log(`Status:${status}`)
                if(status==="addVote") return {...comment,upvotes:comment.upvotes+1}
                else return {...comment,upvotes:comment.upvotes-1}
            }
            else if(comment.id==message_id && vote_type==="downvote"){
                console.log(`Status:${status}`)
                if(status==="addVote") return {...comment,downvotes:comment.downvotes+1}
                else return {...comment,downvotes:comment.downvotes-1}
            }
            if(comment.children.length>0){
                return {...comment,children:updateVotes(comment.children,message_id,status,vote_type)}
            }
            else return comment
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

    // const handleForm2 = () => {
    //     console.log("Handle Form called")
    //     const newReply = {
    //         message: mainInput,
    //         parent: null,
    //     }

    //     const rep: string = JSON.stringify(newReply)
    //     sendMessage(rep)
    //     setMainInput("")
    // }

    const handleVote = (comment_id: number, type: string, status: string) => {
        const resp = {
            task: "vote",
            status: status,
            vote_type: type,
            message_id: comment_id,
            vote_author: localStorage.getItem("name") || ""
        }
        const send_resp = JSON.stringify(resp)
        sendMessage(send_resp)
    }
    const addReply = (comments: Comment[]): Comment[] => {

        return comments.map((comment) => {
            if (comment.id == lastJsonMessage?.parent) {
                console.log(`lastJson:${lastJsonMessage}`)
                return { ...comment, children: [...comment.children, { id: lastJsonMessage?.message_id, author: lastJsonMessage?.username, message: lastJsonMessage?.message,images_msg:"",file_msg:"",children: [], upvotes: 0, downvotes: 0,hasPoll:false}] }
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
                {comment.hasPoll ?<div className="mt-1"><PollComp id={Number(comment.id)}/></div>:
                <div className="bg-white rounded-lg mb-2 border border-gray-200 shadow-sm">
                    <div className="flex items-start p-3 gap-3">

                            {/* Votes section */}
                            <div className="flex flex-col items-center gap-1 min-w-[60px]">
                                <div className="flex">
                                    <button 
                                        onClick={() => {
                                            isUpvoted ? handleVote(comment.id, "upvote", "subtractVote") : handleVote(comment.id, "upvote", "addVote")
                                        }}
                                        className="hover:bg-gray-100 rounded p-1 transition-colors"
                                    >
                                        {isUpvoted ? <ArrowBigUp fill="orange" color="orange" /> : <ArrowBigUp />}
                                    </button>
                                    
                                    <span className="text-sm font-semibold">
                                        {comment.upvotes}
                                    </span>
                                </div>
                                
                                <div className="flex">
                                    <button 
                                        onClick={() => {
                                            isDownvoted ? handleVote(comment.id, "downvote", "subtractVote") : handleVote(comment.id, "downvote", "addVote")
                                        }}
                                        className="hover:bg-gray-100 rounded p-1 transition-colors"
                                    >
                                        {isDownvoted ? <ArrowBigDown fill="orange" color="orange" /> : <ArrowBigDown />}
                                    </button>
                                    
                                    <span className="text-sm font-semibold">
                                        {comment.downvotes}
                                </span>
                                </div>
                                
                            </div>

                            {/* Comment content */}
                            <div className="flex-1 min-w-0">
                                <div className="mb-2">
                                    <Link 
                                        to={`/profile/${comment.author}`}
                                        className="text-sm font-medium text-blue-600 hover:text-orange-500 transition-colors"
                                    >
                                        {comment.author}
                                    </Link>
                                </div>
                                <div className="text-gray-800 break-words space-y-2">
                                <p>{comment.message}</p>

                                {/* If there's an image */}
                                    {comment.images_msg && (
                                        <div>
                                            <img
                                                src={comment.images_msg}
                                                alt="attachment"
                                                className="rounded-lg border border-gray-300 max-w-sm mt-2"
                                                onError={(e) => (e.currentTarget.style.display = "none")}
                                            />
                                        </div>
                                    )}

                                    {/* If there's a file */}
                                    {comment.file_msg && (
                                        <div className="mt-2">
                                            <a
                                                href={comment.file_msg}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline hover:text-blue-800"
                                            >
                                                📎 Download File
                                            </a>
                                        </div>
                                    )}
                                </div>

                                
                                {inputBoxNeeded && (
                                    <form 
                                        onSubmit={(e) => {
                                            e.preventDefault()
                                            handleForm(comment.id, inputComment)
                                            setInputComment("");
                                            setInputBoxNeeded(false);
                                        }}
                                        className="mt-3"
                                    >
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="Add a reply..." 
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                                value={inputComment}
                                                onChange={(e) => setInputComment(e.target.value)} 
                                            />
                                            <button 
                                                type="submit" 
                                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2">
                                {comment.children.length > 0 && (
                                    <button
                                        onClick={() => toggleExpand(comment.id)}
                                        className="hover:bg-gray-100 rounded p-1 transition-colors"
                                        title={expanded ? "Collapse replies" : "Expand replies"}
                                    >
                                        {expanded ? <ArrowUpCircleIcon size={20} /> : <ArrowDownCircleIcon size={20} />}
                                    </button>
                                )}
                                
                                <button
                                    onClick={() => setInputBoxNeeded((prev) => !prev)}
                                    className="hover:bg-gray-100 rounded px-2 py-1 transition-colors text-lg"
                                    title="Reply"
                                >
                                    {inputBoxNeeded ? "✕" : "💬"}
                                </button>
                            </div>
                        </div>

                    {expanded && comment.children.length > 0 && (
                        <div className="ml-12 pl-4 border-l-2 border-gray-300">
                            {comment.children.map((rep) => (
                                <RenderComment comment={rep} margin={margin} key={rep.id} />
                            ))}
                        </div>
                    )}
                </div>}
            </>
        )
    })

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                <ExpandedContext.Provider value={{ getExpanded, toggleExpand }}>
                    <div className="max-w-4xl mx-auto">
                        {comments.map((c) => (
                            <RenderComment comment={c} margin={1} key={c.id} />
                        ))}
                    </div>
                </ExpandedContext.Provider>
            </div>
        </div>
    )
}

export default Message
    