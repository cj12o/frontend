// import React, { useEffect, useState,useRef } from "react";

// const Search = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [chosenMod, setChosenMode] = useState(false);
//   const [moderators, setModerators] = useState<string[]>([]);
//   const [dropDownStatus,setDropDownStatus]=useState(false)
//   const pagination_limit = 5;
//   const containerRef=useRef<HTMLDivElement>(null);
//   const moderator = [
//     "joun",
//     "alex",
//     "amir",
//     "chitransh",
//     "neymar",
//     "ronaldo",
//     "ibra",
//   ];

//    useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setDropDownStatus(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {}, [moderators]);

//   // ✅ Show all mods if searchQuery is empty
//   const filteredMods =
//     searchQuery.trim() === ""
//       ? moderator
//       : moderator.filter((mod) =>
//           mod.toLowerCase().includes(searchQuery.toLowerCase())
//         );

//   return (
//     <div className="w-2/3 relative">
//       <span className="font-semibold mb-3">MODS CHOSEN:</span>
//       <div className="w-full flex flex-wrap gap-2 mt-2 mb-3">
//         {moderators.length > 0 ? (
//           moderators.map((mod) => (
//             <div
//               key={mod}
//               className="group flex bg-red-200 rounded-3xl items-center"
//             >
//               <div className="text-black px-2 py-1 rounded-full">{mod}</div>
//               <button
//                 onClick={() =>
//                   setModerators((prev) => prev.filter((ele) => ele !== mod))
//                 }
//                 className="hidden group-hover:inline text-sm ml-1 rounded-full"
//               >
//                 ⛔
//               </button>
//             </div>
//           ))
//         ) : (
//           <div className="text-gray-400">None</div>
//         )}
//       </div>

//       {/* Search Input */}
//       <input
//         className="w-full border border-gray-400 rounded px-3 py-2"
//         type="text"
//         value={searchQuery}
//         onChange={(e) => {
//           if (chosenMod) setChosenMode(false)
//           setSearchQuery(e.target.value)
//         }}
//         onClick={()=>setDropDownStatus(true)}
//         placeholder="Search moderator..."
//       />

//       {/* Dropdown below input */}
//       {!chosenMod && dropDownStatus && filteredMods.length > 0 && (
//         <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-40 overflow-y-auto">
//           {filteredMods.slice(0, pagination_limit).map((mod) => (
//             <div
//               key={mod}
//               onClick={(e) => {
//                 e.preventDefault();
//                 if (moderators.includes(mod)) return;
//                 setModerators((prev) => [...prev, mod]);
//                 setSearchQuery(mod);
//                 setChosenMode(true);
//               }}
//               className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
//             >
//               {mod}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Search;

import React, { useEffect, useState, useRef } from "react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chosenMod, setChosenMode] = useState(false);
  const [moderators, setModerators] = useState<string[]>([]);
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pagination_limit = 5;

  const moderator = [
    "joun",
    "alex",
    "amir",
    "chitransh",
    "neymar",
    "ronaldo",
    "ibra",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropDownStatus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {}, [moderators]);

  // ✅ Show all mods if searchQuery is empty
  const filteredMods =
    searchQuery.trim() === ""
      ? moderator
      : moderator.filter((mod) =>
          mod.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (chosenMod) setChosenMode(false);
    setSearchQuery(e.target.value);
    setDropDownStatus(true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to hide dropdown after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setDropDownStatus(false);
    }, 2000);
  };

  return (
    <div className="w-2/3 relative" ref={containerRef}>
      <span className="font-semibold mb-3">MODS CHOSEN:</span>
      <div className="w-full flex flex-wrap gap-2 mt-2 mb-3">
        {moderators.length > 0 ? (
          moderators.map((mod) => (
            <div
              key={mod}
              className="group flex bg-red-200 rounded-3xl items-center"
            >
              <div className="text-black px-2 py-1 rounded-full">{mod}</div>
              <button
                onClick={() =>
                  setModerators((prev) => prev.filter((ele) => ele !== mod))
                }
                className="hidden group-hover:inline text-sm ml-1 rounded-full"
              >
                ⛔
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-400">None</div>
        )}
      </div>

      {/* Search Input */}
      <input
        className="w-full border border-gray-400 rounded px-3 py-2"
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        onClick={()=>setDropDownStatus(true)}
        placeholder="Search moderator..."
      />

      {/* Dropdown below input */}
      {!chosenMod && dropDownStatus && filteredMods.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-40 overflow-y-auto">
          {filteredMods.slice(0, pagination_limit).map((mod) => (
            <div
              key={mod}
              onClick={(e) => {
                e.preventDefault();
                if (moderators.includes(mod)) return;
                setModerators((prev) => [...prev, mod]);
                setSearchQuery(mod);
                setChosenMode(true);
                setDropDownStatus(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {mod}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
