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
import { Save, RotateCcw, Lock, Globe, Tag, Sparkles, X } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 flex justify-center items-center">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600 font-medium">
              Updating your room...
            </p>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-2xl border border-white/50">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Edit Room
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-14">
            Update your community space
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Room Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Room Name
            </label>
            <input
              type="text"
              placeholder="Enter room name"
              className="border border-gray-200 px-4 py-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white/50 backdrop-blur-sm"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Topic
            </label>
            <input
              type="text"
              placeholder="Topic"
              className="border border-gray-200 px-4 py-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white/50 backdrop-blur-sm"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Room description"
              className="border border-gray-200 px-4 py-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white/50 backdrop-blur-sm h-28 resize-none"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
            />
          </div>

          {/* Private Toggle */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              {privateStatus ? (
                <Lock className="w-5 h-5 text-indigo-600" />
              ) : (
                <Globe className="w-5 h-5 text-gray-600" />
              )}
              <div>
                <label className="text-sm font-semibold text-gray-700 block">
                  {privateStatus ? "Private Room" : "Public Room"}
                </label>
                <p className="text-xs text-gray-500">
                  {privateStatus
                    ? "Only invited members can join"
                    : "Anyone can discover and join"}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={privateStatus}
                onChange={() => setPrivateStatus((prev) => !prev)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <input
              type="text"
              placeholder="Press Enter to add tags"
              className="border border-gray-200 px-4 py-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white/50 backdrop-blur-sm"
              value={tag}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault();
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
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <div
                key={i}
                className="group flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all"
              >
                <span className="text-sm font-medium">{t}</span>
                <button
                  onClick={() =>
                    setTags((prev) => prev.filter((ele) => ele !== t))
                  }
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5 text-indigo-600 hover:text-indigo-800" />
                </button>
              </div>
            ))}
          </div>

          {/* Moderator Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Moderators
            </label>
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
          <div className="flex gap-3 pt-2">
            <button
              onClick={submitHandler}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
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
              className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomEdit;
