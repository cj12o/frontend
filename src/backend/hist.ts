import axios from "axios";


const sendHist=async (data:any)=>{
    try{
       
        console.log(`to send${data}`)
        await axios.post(import.meta.env.VITE_BASE_EPT+'sethistory/',
            {data},
            {
                headers:{"Content-Type":"application/json",
                    "Authorization":`Token ${localStorage.getItem("cookie")}`
                }
            }
        )
    }
    catch(e){
        console.log(`Error in hist.ts sendHist:${e}`)
    }
    
}

export {sendHist}