import { useEffect, useState } from "react";
import axios from "axios";
import { Divide, Tags } from "lucide-react";
import Search from "@/components/Search";

export default function CreateRoom() {
  const[roomName,setRoomName]=useState("")
  const[roomDescription,setRoomDescription]=useState("")
  const[tags,setTags]=useState<string []>([])
  const [tag,setTag]=useState("")
  
  const [error,setError]=useState("")

  useEffect(()=>{
    if(error.length>0){
        alert(error)
        setError("")
    }
  },[tags,error])

  

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
   
      <h1 className="text-2xl font-semibold mb-4">Create Room</h1>
    
      <div className="space-y-4 max-w-sm">
        <div>
          <input
            type="text"
            placeholder="Room name"
            className="border border-gray-300 px-3 py-2 w-full"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Description"
            className="border border-gray-300 px-3 py-2 w-full"
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value)}
          />
        </div>

        <div >
          <input
            type="text"
            placeholder="tags"
            className="border border-gray-300 px-3 py-2 w-full"
            value={tag}
            onKeyDown={(e) =>{
                if(e.code==="Enter"){
                    if(tag!=""){
                        if(tags.find((tagg)=>tagg===tag)){
                            setError("Already chosen tag")
                            return
                        }
                        setTags((prev)=>[...prev,tag])
                    }
                    setTag("")
                }
                             
            }}
            onChange={(e)=>{
                setTag(e.target.value)
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2 max-w-full">
            {tags.length > 0
                ? tags.map((tag: string, i) => {
                    if (tag !== "") {
                    return (
                        <div
                        key={i}
                        className="group flex items-center bg-red-200 rounded-3xl px-2 py-1 mt-2"
                        >
                        <span className="mr-1">{tag}</span>
                        <button
                            onClick={() =>
                            setTags((prev) => prev.filter((ele) => ele !== tag))
                            }
                            className="hidden group-hover:inline text-sm ml-1 bg-red-400 rounded-full"
                        >
                            ⛔
                        </button>
                        </div>
                    );
                    }
                    return null;
                })
            : null}
        </div>

        <div
        >
          
          <Search/>
        </div>

        <button
          
          className="bg-blue-600 text-white px-4 py-2"
        >
          Create
        </button>
      </div>
    </div>
  );
}
