import axios from "axios";
import { AxeIcon } from "lucide-react";



const getProfile=async (name:string)=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_PROFILE_EPT+`${name}/`,
            {
                headers:{"Content-Type":"application/json"}
            }
        )
        console.log(`Respnose getProfile:${resp.data}`)
        return resp.data
    }
    catch(e:any){
        console.log(`Error in getProfile:${e}`)
    }
}


export {getProfile}