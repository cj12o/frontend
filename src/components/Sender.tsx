import React,{useContext,useState} from 'react'
import { WebSocketContext } from '../pages/WebSocketProvider';
import { Clipboard } from 'lucide-react';
import { postMsg } from '@/backend/message';
import { useParams } from 'react-router-dom';


export const Sender = () => {
    const { sendMessage, lastJsonMessage } = useContext(WebSocketContext)
    const [input,setMainInput]=useState("")
    const [fileurl,setFileUrl]=useState<File|null>(null)
    const [imageurl,setImageUrl]=useState<File|null>(null)
    
    const handleForm2 = () => {//plain message
        console.log("Handle Form called")
        const newReply = {
            message: input,
            parent: null,
        }
        console.log(newReply)
        const rep: string = JSON.stringify(newReply)
        sendMessage(rep)
        setMainInput("")
    }
    const {id}=useParams()

    const handleForm3 = (roomid:number,message:string,file:File|null,image:File|null) => {//on REST Principle
        postMsg(roomid,message,file,image)
    }
    return (
        <div className='p-5'>
            <form action="" onSubmit={(e)=>{
                e.preventDefault()
                if(fileurl!=null || imageurl!=null){
                    handleForm3(Number(id),input,fileurl,imageurl)
                }
                else handleForm2()
            }} >
                <div className='flex'>
                    <div className='w-2/3'>
                        <input type="text" name="" id="" value={input}
                        placeholder='type your message..' 
                        className='bg-gray-200 p-2 rounded-xl w-full'
                        onChange={(e)=>{
                            e.preventDefault()
                            setMainInput(e.target.value)
                        }}/>
                    </div>
                    <div className='w-1/3'>
                        <button type='submit' className='ml-3 p-2 rounded bg-blue-500'
                        >Send</button>
                    </div>
                    <form>
                        <input type="file"  
                        onChange={(e)=>{
                            if(e.target.files && e.target.files[0]){
                                setFileUrl(e.target.files[0])}
                            }
                        }/>
                    </form>
                    <form>
                        <input type="file"
                        accept='image/*'  
                        onChange={(e)=>{
                            if(e.target.files && e.target.files[0]){
                                setImageUrl(e.target.files[0])}
                            }
                        }/>
                    </form>
                </div>        
            </form>
        </div>
    )
}


export default Sender