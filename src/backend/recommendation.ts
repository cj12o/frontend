import axios from "axios"

const getRecommendations=async()=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_RECOM_EPT,
            {headers:{"Content-Type":"application/json",
                "Authorization":`Token ${localStorage.getItem("cookie")}`}
            }
        )
        return resp?.data
    }
    catch(e:any){
        console.log(`Error in getRecommendations ${e.message}`)
    }  
}

const SaveRecommendation=async()=>{
    try{
        const resp=await axios.post(import.meta.env.VITE_RECOM_EPT,
            {
                "sessionId":localStorage.getItem("sessionId")
            },
            {headers:{"Content-Type":"application/json",
                "Authorization":`Token ${localStorage.getItem("cookie")}`}
            }
        )
    }catch(e){

    }
    
    
}

export {getRecommendations,SaveRecommendation}