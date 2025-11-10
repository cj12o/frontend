import React,{useContext,useState} from 'react'
import { WebSocketContext } from '../pages/WebSocketProvider';
import { Clipboard } from 'lucide-react';
export const Sender = () => {
    const { sendMessage, lastJsonMessage } = useContext(WebSocketContext)
    const [input,setMainInput]=useState("")
    
    const handleForm2 = () => {
        console.log("Handle Form called")
        const newReply = {
            message: input,
            parent: null,
        }

        const rep: string = JSON.stringify(newReply)
        sendMessage(rep)
        setMainInput("")
    }

    return (
        <div className='p-5'>
            <form action="" onSubmit={(e)=>{
                e.preventDefault()
                handleForm2()
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
                        <input type="file"/>
                    </form>
                </div>        
            </form>
        </div>
    )
}


export default Sender