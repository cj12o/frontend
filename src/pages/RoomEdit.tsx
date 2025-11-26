
// import { useEffect, useState } from "react";
// import Search from "@/components/Search";
// import type { Moderator } from "@/types/moderator";
// import {updateRoom} from "@/backend/room";
// import { useParams } from "react-router-dom";
// import { getRoomdetail } from "@/backend/room";


// const RoomEdit = () => {
//   const[roomName,setRoomName]=useState("")
//   const[roomDescription,setRoomDescription]=useState("")
//   const[tags,setTags]=useState<string []>([])
//   const [tag,setTag]=useState("")
//   const [topic,setTopic]=useState("")
//   const [privateStatus,setPrivateStatus]=useState(false)
  
//   const [error,setError]=useState("")
  
//   const[loading,setLoading]=useState(false)

//   //todo: mods
//   const [moderator, setModerator] = useState<Moderator[]>([]);

  
//   //todo  
//   const {id}=useParams()

  


//   // const loadData=()=>{
//   //   try{
//   //     const mockModerators: Moderator[] = [
//   //       {
//   //         msg_count: 4,
//   //         vote_count: 0,
//   //         username: "ALEX_123",
//   //         id: 4,
//   //       },
//   //       {
//   //         msg_count: 0,
//   //         vote_count: 0,
//   //         username: "chitransh",
//   //         id: 1,
//   //       },
//   //       {
//   //         msg_count: 12,
//   //         vote_count: 5,
//   //         username: "PriyaMod",
//   //         id: 7,
//   //       },
//   //       {
//   //         msg_count: 9,
//   //         vote_count: 2,
//   //         username: "AutoGuardian",
//   //         id: 9,
//   //       },
//   //     ]
//   //     setRoomName("test 1")
//   //     setTags(["git","tensorflow","api"])
//   //     setTopic("Technology")
//   //     setRoomDescription("A space dedicated to cloud under technology. Members discuss and share ideas about Git, TensorFlow, API and related trends.")
//   //     setAvailableModerators(mockModerators)
//   //     setModerator(mockModerators.slice(0,2))
//   //     setPrivateStatus(true)
//   //   }catch(e){

//   //   }
    
//   // }

//   const loadData=async()=>{
//     try{
//       const resp=await getRoomdetail(Number(id))
//       setRoomName(resp.name)
//       resp.tags.length>0?setTags(resp.tags):setTags([])
//       setTopic(resp.parent_topic)
//       setRoomDescription(resp.description)
//       setModerator(resp.moderator)
//       setPrivateStatus(resp.is_private)

//     }catch(e:any){
//       setError(e)
//     }
//   }
//   useEffect(()=>{    
//     loadData()
//   },[])

//   const submitHandler=async()=>{
//     setLoading(true)
//     const privateStataus_val=privateStatus?1:0

//     const mod_id:number[]=[]
//     moderator.map((mod)=>{
//       mod_id.push(mod.id)
//     })

//     const resp=await updateRoom(Number(id),roomName,roomDescription,topic,privateStataus_val,tags,mod_id)
//     if(resp===200){
//       setLoading(false)
//       alert("Room updated successfully")
//     }
//     else{
//       setLoading(false)
//       setError("Room updation failed")
//     }
//   }  

//   return (
//     <div className="min-h-screen bg-white text-gray-900 p-8">
//     {loading && (
//       <div className="fixed inset-0 bg-white bg-opacity-40 flex justify-center items-center">
//         <div className="h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     )}

//     {
//       error.length>0?<p className="text-red-600">{error}</p>:null
//     }
//       <h1 className="text-2xl font-semibold mb-4">Create Room</h1>
    
//       <div className="space-y-4 max-w-sm">
//         <div>
//           <input
//             type="text"
//             placeholder="Room name"
//             className="border border-gray-300 px-3 py-2 w-full"
//             value={roomName}
//             onChange={(e) => setRoomName(e.target.value)}
//           />
//         </div>

//         <div>
//           <input
//             type="text"
//             placeholder="Room Topic"
//             className="border border-gray-300 px-3 py-2 w-full"
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//           />
//         </div>

//         <div>
//           <input
//             type="text"
//             placeholder="Description"
//             className="border border-gray-300 px-3 py-2 w-full"
//             value={roomDescription}
//             onChange={(e) => setRoomDescription(e.target.value)}
//           />
//         </div>
//         <div className="flex ">
//           <label htmlFor="checkbox" className="mr-5">Private</label>
//           <input type="checkbox" name="checkbox" id="" 
//           checked={privateStatus}
//           onChange={()=>setPrivateStatus((prev)=>!prev)}/>
//         </div>
//         <div >
//           <input
//             type="text"
//             placeholder="tags"
//             className="border border-gray-300 px-3 py-2 w-full"
//             value={tag}
//             onKeyDown={(e) =>{
//                 if(e.code==="Enter"){
//                     if(tag!=""){
//                         if(tags.find((tagg)=>tagg===tag)){
//                             setError("Already chosen tag")
//                             return
//                         }
//                         setTags((prev)=>[...prev,tag])
//                     }
//                     setTag("")
//                 }
                             
//             }}
//             onChange={(e)=>{
//                 setTag(e.target.value)
//             }}
//           />
//         </div>
//         <div className="flex flex-wrap gap-2 max-w-full">
//             {tags.length > 0
//                 ? tags.map((tag: string, i) => {
//                     if (tag !== "") {
//                     return (
//                         <div
//                         key={i}
//                         className="group flex items-center bg-red-200 rounded-3xl px-2 py-1 mt-2"
//                         >
//                         <span className="mr-1">{tag}</span>
//                         <button
//                             onClick={() =>
//                             setTags((prev) => prev.filter((ele) => ele !== tag))
//                             }
//                             className="hidden group-hover:inline text-sm ml-1 bg-red-400 rounded-full"
//                         >
//                             ⛔
//                         </button>
//                         </div>
//                     );
//                     }
//                     return null;
//                 })
//             : null}
//         </div>
//         <div>
//           <Search value={{setModerator:setModerator,moderator:moderator,flag:1,room_id:Number(id)}}/>
//         </div>

//         <button
//           onClick={submitHandler}
//           className="bg-blue-600 text-white px-4 py-2"
//         >
//           Update
//         </button>
//         <button
//         onClick={()=>{
//           setRoomName("")
//           setTags([])
//           setTopic("")
//           setRoomDescription("")
//           setModerator([])
//           setPrivateStatus(false)
//         }}>
//           Clear
//         </button>
//       </div>
//     </div>
//   );
// }


// export default RoomEdit
import { useEffect, useState } from "react";
import Search from "@/components/Search";
import type { Moderator } from "@/types/moderator";
import { updateRoom } from "@/backend/room";
import { useParams } from "react-router-dom";
import { getRoomdetail } from "@/backend/room";

const RoomEdit = () => {
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState("");
  const [topic, setTopic] = useState("");
  const [privateStatus, setPrivateStatus] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [moderator, setModerator] = useState<Moderator[]>([]);
  const { id } = useParams();

  const loadData = async () => {
    try {
      const resp = await getRoomdetail(Number(id));
      setRoomName(resp.name);
      resp.tags.length > 0 ? setTags(resp.tags) : setTags([]);
      setTopic(resp.parent_topic);
      setRoomDescription(resp.description);
      setModerator(resp.moderator);
      setPrivateStatus(resp.is_private);
    } catch (e: any) {
      setError(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitHandler = async () => {
    setLoading(true);
    const privateStataus_val = privateStatus ? 1 : 0;

    const mod_id: number[] = [];
    moderator.map((mod) => {
      mod_id.push(mod.id);
    });

    const resp = await updateRoom(
      Number(id),
      roomName,
      roomDescription,
      topic,
      privateStataus_val,
      tags,
      mod_id
    );

    if (resp === 200) {
      setLoading(false);
      alert("Room updated successfully");
    } else {
      setLoading(false);
      setError("Room updation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 flex justify-center">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Room</h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <div className="space-y-5">

          {/* Room Name */}
          <div>
            <label className="block text-sm mb-1 font-medium">Room Name</label>
            <input
              type="text"
              placeholder="Enter room name"
              className="border border-gray-300 px-4 py-2 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm mb-1 font-medium">Topic</label>
            <input
              type="text"
              placeholder="Topic"
              className="border border-gray-300 px-4 py-2 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1 font-medium">Description</label>
            <textarea
              placeholder="Room description"
              className="border border-gray-300 px-4 py-2 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none h-24 resize-none"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
            />
          </div>

          {/* Private Toggle */}
          <div className="flex items-center gap-3 mt-2">
            <label className="text-sm font-medium">Private Room</label>
            <input
              type="checkbox"
              checked={privateStatus}
              onChange={() => setPrivateStatus((prev) => !prev)}
              className="h-5 w-5 accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm mb-1 font-medium">Tags</label>
            <input
              type="text"
              placeholder="Press Enter to add"
              className="border border-gray-300 px-4 py-2 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              value={tag}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  if (tag !== "") {
                    if (tags.includes(tag)) {
                      setError("Tag already exists");
                      return;
                    }
                    setTags((prev) => [...prev, tag]);
                  }
                  setTag("");
                }
              }}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>

          {/* Tag Chips */}
          <div className="flex flex-wrap gap-2 max-w-full">
            {tags.map((t, i) => (
              <div
                key={i}
                className="group flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 shadow-sm"
              >
                <span>{t}</span>
                <button
                  onClick={() =>
                    setTags((prev) => prev.filter((ele) => ele !== t))
                  }
                  className="hidden group-hover:flex ml-2 bg-blue-300 text-white rounded-full px-2 py-0.5 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Moderator Search */}
          <div>
            <Search
              value={{
                setModerator: setModerator,
                moderator: moderator,
                flag: 1,
                room_id: Number(id),
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={submitHandler}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Update Room
            </button>

            <button
              onClick={() => {
                setRoomName("");
                setTags([]);
                setTopic("");
                setRoomDescription("");
                setModerator([]);
                setPrivateStatus(false);
              }}
              className="bg-gray-200 px-5 py-2.5 rounded-lg shadow hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomEdit;
