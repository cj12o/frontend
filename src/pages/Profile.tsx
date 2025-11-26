// import React, { useEffect, useState } from "react";
// import { Camera, Mail, Hash, Clock ,Trash2,SettingsIcon,Send} from "lucide-react";
// import { getProfile ,updateProfile} from "@/backend/profile.ts";
// import { useParams,Link, useNavigate} from "react-router-dom";
// import { buttonVariants } from "@/components/ui/button";
// import { useDispatch } from "react-redux";



// export default function UserProfile() {
//   type UserData = {
//     id: number;
//     bio: string;
//     last_seen: string;
//     is_online: boolean;
//     profile_pic: any;
//     roles: string;
//     created_at: string;
//     user: number;
//   };
//   type RoomDetails = {
//     name: string;
//     id: number;
//   };
//   type ProfileData = {
//     userdata: UserData[];
//     name: string;
//     rooms_member: RoomDetails[];
//     email: string;
//     rooms_created: RoomDetails[];
//   };

//   const [data, setData] = useState<ProfileData | null>(null);
//   const [loading, setLoading] = useState(true);
//   //image url
//   const [toBeupdateImageurl,setToUpdateImageUrl]=useState<File|null>(null)
//   //de;ete imag
//   const[deleteImg,setDeleteImg]=useState<boolean>(false)
//   const [errors,setErrors]=useState<string []>([])
//   const [displayActionBtn,setDisplayActionBtn]=useState(false)
//   // state for bio
//   const [updatedBio,setUpdatedBio]=useState("")
//   const [editBio,setEditbio]=useState(false)
//   // state for email
//   const [updatedEmail,setUpdatedEmail]=useState("")
//   const [editEmail,setEditEmail]=useState(false)

//   // state for username
//   const [updatedUsername,setUpdatedUsername]=useState("")
//   const [editUsername,setEditUsername]=useState(false)
  
//   const params = useParams<{ name: string }>();
//   const navigate = useNavigate()

//   const fileInputRef = React.useRef<HTMLInputElement | null>(null);
//   const getProfileData = async (name: string) => {
//     try {
//       const resp = await getProfile(name);
//       setData(resp);
//       setUpdatedBio(resp.userdata[0].bio)
//       setUpdatedEmail(resp.email)
//       setUpdatedUsername(resp.name)
      
//     } catch (e) {
//       console.error("Profile fetch error:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const dispatch=useDispatch()

//   const upload = async() => {
//     //sends updated data to backend
//     try {
//       const oldUsername = data?.name;
//       const status = await updateProfile(toBeupdateImageurl,deleteImg,updatedBio, updatedEmail, updatedUsername,dispatch) 
      
//       setToUpdateImageUrl(null)
//       setEditbio(false)
//       setEditEmail(false)
//       setEditUsername(false)
      
//       // If username was changed, navigate to new profile URL
//       if (updatedUsername !== oldUsername) {
//         navigate(`/profile/${updatedUsername}`)
//       } else {
//         // Refetch profile data with current username
//         if (params.name) {
//           getProfileData(params.name)
//         }
//       }
        
//     } catch(e:any) {
//       setErrors((prev) => [...prev, e.message])
//     }
//   }

//   useEffect(() => {
//     if (params.name) getProfileData(params.name);
//   }, [params.name]);

//   if (loading)
//     return (
//       <div className="flex items-center justify-center h-screen bg-blue-50">
//         <div className="animate-pulse text-xl font-semibold text-indigo-500">
//           Loading profile...
//         </div>
//       </div>
//     );

//   if (!data)
//     return (
//       <div className="flex items-center justify-center h-screen text-gray-500">
//         User not found.
//       </div>
//     );

//   const user = data.userdata[0];

//   const username_localstorage: string = localStorage.getItem("name") || ""
  


//   return (
//     <>
//       <div className="flex h-screen bg-gray-50">
//         <div className="w-1/2 flex flex-col overflow-hidden p-4">
//           {/* Profile Header Card */}
//           <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-transparent hover:border-indigo-300">
//             <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl relative">
//               <div className="absolute left-6 bottom-[-2.5rem]">
//                 <div className="relative h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-visible">
//                   <div className="h-full w-full rounded-full overflow-hidden">
//                     {user.profile_pic ? (
//                       <img
//                         src={user.profile_pic}
//                         alt="Profile"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="h-full w-full flex items-center justify-center text-3xl font-bold bg-indigo-600 text-white">
//                         {data.name.charAt(0).toUpperCase()}
//                       </div>
//                     )}
//                   </div>
//                   {
//                     username_localstorage == data.name ? (
//                       <button
//                       onClick={() => {
//                         setDisplayActionBtn((prev) => !prev)
//                       }}
//                       className="absolute bottom-0 right-0">
//                         <SettingsIcon size={20} className="rounded-full bg-gray-200 border-2 "/>
//                       </button>
//                     ) : (
//                       <span
//                       className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
//                         user.is_online ? "bg-green-500" : "bg-gray-400"
//                       }`}
//                       />
//                     )
//                   }
//                 </div>
//               </div>
//             </div>

//             {/* Basic Info */}
//             <div className="pt-14 px-6 pb-4 grid flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  
//               {/* {Action btns} */}
//               {displayActionBtn && <div className="border-1 rounded-full p-1 w-max bg-green-100">
//                 {username_localstorage == data.name && !toBeupdateImageurl && (
//                     <button 
//                     className="ml-2 bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full shadow-md transition"
//                       onClick={(e) => {
//                         e.preventDefault()
//                         fileInputRef.current?.click()
//                       }}>
//                       <Camera size={16} className="text-white" />
//                     </button>
//                   )
//                 }
                 
//                 {
//                     //delete btn
//                     username_localstorage == data.name && data.userdata[0].profile_pic && (
//                     <button 
//                     className="ml-2 mr-2 bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full shadow-md transition"
                    
//                       onClick={(e) => {
//                         e.preventDefault()
//                         setDeleteImg((prev) => !prev)
//                         upload()
//                       }}>
//                       <Trash2 size={16} className="text-white" />
//                     </button>
//                   )
//                 }
//                 {username_localstorage == data.name && toBeupdateImageurl && (
//                   <button
//                   className="ml-2 mr-2 bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full shadow-md transition"
                  
//                   onClick={(e) => {
//                     e.preventDefault()
//                     upload()
//                   }}>
//                     <Send size={16} />
//                   </button>    
//                 )
//                 }
//               </div>
//               }
              
//               <div className="flex-1">
//                 <div className="flex items-center gap-3">
//                   {editUsername && username_localstorage === data.name ? (
//                     <input 
//                       type="text" 
//                       value={updatedUsername}
//                       onChange={(e) => setUpdatedUsername(e.target.value)}
//                       className="border border-gray-300 rounded px-3 py-2 text-2xl font-semibold"
//                     />
//                   ) : (
//                     <h1 className="text-2xl font-semibold text-gray-800">{data.name}</h1>
//                   )}
//                   {username_localstorage === data.name && (
//                     <div className="flex items-center gap-2">
//                       {editUsername ? (
//                         <>
//                           <button
//                             onClick={(e) => {
//                               e.preventDefault()
//                               upload()
//                             }}
//                             className="text-blue-600 hover:underline text-sm font-medium"
//                           >
//                             Save
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.preventDefault()
//                               setEditUsername(false)
//                               setUpdatedUsername(data.name)
//                             }}
//                             className="text-gray-600 hover:underline text-sm font-medium"
//                           >
//                             Cancel
//                           </button>
//                         </>
//                       ) : (
//                         <button
//                           onClick={(e) => {
//                             e.preventDefault()
//                             setEditUsername(true)
//                           }}
//                           className="text-blue-600 hover:underline text-sm font-medium"
//                         >
//                           Edit
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex flex-wrap items-center gap-3 text-gray-500 mt-3 text-xs">
//                   <span className="flex items-center gap-1">
//                     <Hash size={12} /> ID: {user.id}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Mail size={12} /> 
//                     {editEmail && username_localstorage === data.name ? (
//                       <input 
//                         type="email" 
//                         value={updatedEmail}
//                         onChange={(e) => setUpdatedEmail(e.target.value)}
//                         className="border border-gray-300 rounded px-2 py-1 text-xs"
//                       />
//                     ) : (
//                       updatedEmail
//                     )}
//                   </span>
//                   {username_localstorage === data.name && (
//                     <span className="flex items-center gap-1">
//                       {editEmail ? (
//                         <>
//                           <button
//                             onClick={(e) => {
//                               e.preventDefault()
//                               upload()
//                             }}
//                             className="text-blue-600 hover:underline text-xs"
//                           >
//                             Save
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.preventDefault()
//                               setEditEmail(false)
//                               setUpdatedEmail(data.email)
//                             }}
//                             className="text-gray-600 hover:underline text-xs"
//                           >
//                             Cancel
//                           </button>
//                         </>
//                       ) : (
//                         <button
//                           onClick={(e) => {
//                             e.preventDefault()
//                             setEditEmail(true)
//                           }}
//                           className="text-blue-600 hover:underline text-xs"
//                         >
//                           Edit
//                         </button>
//                       )}
//                     </span>
//                   )}
//                   <span className="flex items-center gap-1">
//                     <Clock size={12} /> Last seen: {user.last_seen}
//                   </span>
//                 </div>
//               </div>

//             </div>
//           </div>

//           {/* Bio Section */}
//           <div className="w-full max-w-4xl flex mt-4 bg-white rounded-2xl shadow-md p-4 border border-transparent hover:border-indigo-200 transition-all">
            
//             <div className="w-4/5">
            
//               <h2 className="text-sm font-semibold text-gray-800 mb-2">Bio</h2>
//               {
//                 !editBio ? (
//                   <p className="text-gray-600 leading-relaxed text-sm">{updatedBio || "This user hasn't added a bio yet."}</p>
//                 ) : (
//                   <input 
//                   type="text" 
//                   value={updatedBio}
//                   onChange={(e) => {
//                     setUpdatedBio(e.target.value)
//                   }}
//                   className="w-full border border-gray-300 rounded px-2 py-1"
//                   />
//                 )
//               }
              
              
//             </div>
//             <div>
//               {
//                 data.name == username_localstorage ? (
//                   <>
//                   {editBio ? (
//                     <>
//                     <a
//                     className="m-1 text-blue-600 hover:underline cursor-pointer"
//                     onClick={(e) => {
//                       e.preventDefault()
//                       upload()
//                     }}>
//                       Save
//                     </a>

//                     {/* {go back} */}
//                     <a
//                     className="m-1 text-blue-600 hover:underline cursor-pointer"
//                     onClick={(e) => {
//                       e.preventDefault()
//                       setEditbio(false)
//                     }}>
//                       Cancel
//                     </a>
//                     </>
//                   ) : (
//                     <a 
//                     className="mr-5 text-blue-600 hover:underline cursor-pointer"
//                     onClick={(e) => {
//                       e.preventDefault()
//                       setEditbio(true)
//                     }}>
//                       Edit
//                     </a>
//                   )}
//                   </>
//                 ) : (<></>)
//               }
//             </div>
            
//           </div>

//           {/* Created At */}
//           <div className="mt-4 text-gray-500 text-xs">
//             Account created at:{" "}
//             <span className="font-medium text-gray-700">{user.created_at}</span>
//           </div>
          
//           <div className="mt-3">
            
            
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={(e) => {
//                   if(e.target.files && e.target.files[0]){
//                     setToUpdateImageUrl(e.target.files[0])
//                   }
//                 }}
//               />
           
           
//           </div>
//         </div>

//         {/* Right Side - Rooms Info */}
//         <div className="w-1/2 p-6 overflow-y-auto bg-white">
//           <h2 className="text-lg font-semibold text-gray-800 mb-6">Rooms</h2>

//           <div className="grid gap-6">
//             <div>
//               <h3 className="text-md font-semibold text-indigo-700 mb-3">
//                 Created Rooms
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {data.rooms_created.length > 0 ? (
//                   data.rooms_created.map((room) => (
//                     <Link
//                     key={room.id}
//                     to={`/rooms/${room.id}/messages`}
//                     className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-200 transition"
//                   >
//                     {room.name}
//                   </Link>
//                   ))
//                 ) : (
//                   <p className="text-gray-400 text-sm">No created rooms</p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <h3 className="text-md font-semibold text-green-700 mb-3">
//                 Member Of
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {data.rooms_member.length > 0 ? (
//                   data.rooms_member.map((room) => (
                    
//                     <div
//                     key={room.id}
//                     className="bg-green-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-medium hover:bg-indigo-200 transition"
//                   >
//                     <div className="hover:visible">

//                       <button
//                       className="bg-indigo-400 p-3"
//                       onClick={()=>{
//                         navigate(`/rooms/${room.id}/edit`)
//                       }}>Edit</button>

//                       <button
//                       onClick={()=>{
//                         navigate(`/rooms/${room.id}/messages`)
//                       }}
//                       className="bg-orange-400"
//                       >visit</button>

//                     </div>
//                     {room.name}
//                   </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-400 text-sm">No memberships</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { Camera, Mail, Hash, Clock, Trash2, SettingsIcon, Send } from "lucide-react";
import { getProfile, updateProfile } from "@/backend/profile.ts";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function UserProfile() {
  type UserData = {
    id: number;
    bio: string;
    last_seen: string;
    is_online: boolean;
    profile_pic: any;
    roles: string;
    created_at: string;
    user: number;
  };

  type RoomDetails = {
    name: string;
    id: number;
  };

  type ProfileData = {
    userdata: UserData[];
    name: string;
    rooms_member: RoomDetails[];
    email: string;
    rooms_created: RoomDetails[];
  };

  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // IMAGE
  const [toBeupdateImageurl, setToUpdateImageUrl] = useState<File | null>(null);
  const [deleteImg, setDeleteImg] = useState<boolean>(false);

  // GENERAL UI STATE
  const [errors, setErrors] = useState<string[]>([]);
  const [displayActionBtn, setDisplayActionBtn] = useState(false);

  // FIELDS
  const [updatedBio, setUpdatedBio] = useState("");
  const [editBio, setEditbio] = useState(false);

  const [updatedEmail, setUpdatedEmail] = useState("");
  const [editEmail, setEditEmail] = useState(false);

  const [updatedUsername, setUpdatedUsername] = useState("");
  const [editUsername, setEditUsername] = useState(false);

  const params = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Fetch profile
  const getProfileData = async (name: string) => {
    try {
      const resp: ProfileData = await getProfile(name);
      setData(resp);

      setUpdatedBio(resp.userdata[0].bio);
      setUpdatedEmail(resp.email);
      setUpdatedUsername(resp.name);
    } catch (e) {
      console.log("Profile error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Send updates
  const upload = async () => {
    try {
      const oldUsername = data?.name;

      await updateProfile(
        toBeupdateImageurl,
        deleteImg,
        updatedBio,
        updatedEmail,
        updatedUsername,
        dispatch
      );

      setToUpdateImageUrl(null);
      setEditbio(false);
      setEditEmail(false);
      setEditUsername(false);

      if (updatedUsername !== oldUsername) {
        navigate(`/profile/${updatedUsername}`);
        return;
      }

      if (params.name) getProfileData(params.name);
    } catch (e: any) {
      setErrors((prev) => [...prev, e.message]);
    }
  };

  useEffect(() => {
    if (params.name) getProfileData(params.name);
  }, [params.name]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="animate-pulse text-xl font-semibold text-indigo-500">
          Loading profile...
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        User not found.
      </div>
    );

  const user = data.userdata[0];
  const username_localstorage = localStorage.getItem("name") || "";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT SIDE */}
      <div className="w-1/2 flex flex-col overflow-hidden p-4">

        {/* PROFILE CARD */}
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-lg hover:shadow-2xl border hover:border-indigo-300 transition-all">

          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl relative">
            <div className="absolute left-6 bottom-[-2.5rem]">

              {/* Profile pic */}
              <div className="relative h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-visible">

                <div className="h-full w-full rounded-full overflow-hidden">
                  {user.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-indigo-600 text-white text-3xl font-bold">
                      {data.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Settings */}
                {username_localstorage === data.name ? (
                  <button
                    onClick={() => setDisplayActionBtn((p) => !p)}
                    className="absolute bottom-0 right-0"
                  >
                    <SettingsIcon size={20} className="bg-gray-200 rounded-full p-1" />
                  </button>
                ) : (
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      user.is_online ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="pt-14 px-6 pb-4 flex items-start gap-4">

            {displayActionBtn && (
              <div className="p-2 bg-gray-100 rounded-xl flex gap-2">

                {/* Upload Image */}
                {username_localstorage === data.name && !toBeupdateImageurl && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full"
                  >
                    <Camera size={16} className="text-white" />
                  </button>
                )}

                {/* Delete Image */}
                {username_localstorage === data.name && user.profile_pic && (
                  <button
                    onClick={() => {
                      setDeleteImg(true);
                      setTimeout(upload, 0);
                    }}
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-full"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                )}

                {/* Confirm upload */}
                {toBeupdateImageurl && (
                  <button
                    onClick={upload}
                    className="bg-green-600 hover:bg-green-700 p-2 rounded-full"
                  >
                    <Send size={16} className="text-white" />
                  </button>
                )}
              </div>
            )}

            {/* TEXT DETAILS */}
            <div className="flex-1">

              {/* Username */}
              <div className="flex items-center gap-2">
                {editUsername ? (
                  <input
                    value={updatedUsername}
                    onChange={(e) => setUpdatedUsername(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  <h1 className="text-2xl font-semibold">{data.name}</h1>
                )}

                {username_localstorage === data.name && (
                  editUsername ? (
                    <>
                      <button onClick={upload} className="text-blue-600 text-sm">Save</button>
                      <button
                        onClick={() => {
                          setEditUsername(false);
                          setUpdatedUsername(data.name);
                        }}
                        className="text-gray-600 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditUsername(true)}
                      className="text-blue-600 text-sm"
                    >
                      Edit
                    </button>
                  )
                )}
              </div>

              {/* Email + ID + last seen */}
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">

                <span className="flex items-center gap-1">
                  <Hash size={12} /> ID: {user.id}
                </span>

                <span className="flex items-center gap-1">
                  <Mail size={12} />

                  {editEmail ? (
                    <input
                      value={updatedEmail}
                      onChange={(e) => setUpdatedEmail(e.target.value)}
                      className="border px-1 py-1 rounded"
                    />
                  ) : (
                    updatedEmail
                  )}
                </span>

                {username_localstorage === data.name && (
                  editEmail ? (
                    <>
                      <button onClick={upload} className="text-blue-600 text-xs">Save</button>
                      <button
                        onClick={() => {
                          setEditEmail(false);
                          setUpdatedEmail(data.email);
                        }}
                        className="text-gray-600 text-xs"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditEmail(true)}
                      className="text-blue-600 text-xs"
                    >
                      Edit
                    </button>
                  )
                )}

                <span className="flex items-center gap-1">
                  <Clock size={12} /> Last seen: {user.last_seen}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BIO */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-4 mt-4">
          <div className="flex justify-between items-start">
            <div className="w-4/5">
              <h2 className="text-sm font-semibold mb-1">Bio</h2>

              {!editBio ? (
                <p className="text-gray-600 text-sm">{updatedBio || "No bio added."}</p>
              ) : (
                <textarea
                  value={updatedBio}
                  onChange={(e) => setUpdatedBio(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              )}
            </div>

            {username_localstorage === data.name && (
              editBio ? (
                <div className="flex gap-2">
                  <button onClick={upload} className="text-blue-600">Save</button>
                  <button
                    onClick={() => setEditbio(false)}
                    className="text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditbio(true)}
                  className="text-blue-600"
                >
                  Edit
                </button>
              )
            )}
          </div>
        </div>

        {/* Created */}
        <div className="mt-2 text-xs text-gray-500">
          Account created: <span className="text-gray-700">{user.created_at}</span>
        </div>

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files?.[0]) setToUpdateImageUrl(e.target.files[0]);
          }}
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 p-6 bg-white overflow-y-auto">

        <h2 className="text-lg font-semibold mb-6">Rooms</h2>

        {/* Created Rooms */}
        <div className="mb-6">
          <h3 className="font-semibold text-indigo-700 mb-2">Created Rooms</h3>
          <div className="flex flex-wrap gap-2">
            {data.rooms_created.length ? (
              data.rooms_created.map((room) => (
                <div
                  key={room.id}
                  className="relative bg-green-100 text-indigo-800 px-3 py-1 rounded-lg text-sm w-max group"
                >
                  <div
                  className="hidden group-hover:inline">
                  <button
                    onClick={() => navigate(`/rooms/${room.id}/edit`)}
                    className="bg-orange-200  p-1 rounded-full"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => navigate(`/rooms/${room.id}/messages`)}
                    className="ml-1 bg-blue-200 hidden group-hover:inline p-1 rounded-full"
                  >
                    Visit
                  </button>
                  </div>
            

                  {room.name}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No created rooms</p>
            )}
          </div>
        </div>

        {/* Member Rooms */}
        <div>
          <h3 className="font-semibold text-green-700 mb-2">Member Of</h3>

          <div className="flex flex-wrap gap-4">
            {data.rooms_member.length ? (
              data.rooms_member.map((room) => (
                <div
                  key={room.id}
                  className="relative bg-green-100 text-indigo-800 px-3 py-1 rounded-lg text-sm w-max group"
                >
      
                  
                  <button
                    onClick={() => navigate(`/rooms/${room.id}/messages`)}
                    className="ml-1 bg-blue-200 hidden group-hover:inline p-1 rounded-full"
                  >
                    Visit
                  </button>
                

                  {room.name}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No memberships</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
