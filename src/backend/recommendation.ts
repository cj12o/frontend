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

export {getRecommendations}