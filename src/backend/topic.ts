import axios  from "axios";


const getTopics=async ()=>{
    try{
        const resp=await axios.get(import.meta.env.VITE_BASE_EPT+`topics/`,
            {headers:{"Content-Type":"application/json"}}
        )
        // console.log(resp?.data?.topics)
        
        return resp?.data?.topics
    }
    catch(e:any){
        console.log(`error ${e}`)
    }

}

export {getTopics}