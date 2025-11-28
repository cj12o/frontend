

import React, { useEffect, useState, useRef } from "react";
import type { Moderator } from "@/types/moderator";
import { getStats } from "@/backend/getStats";

//flag 0:create room ,1: edit room
type SearchProps = {
  value: {
    moderator: Moderator[];
    setModerator: React.Dispatch<React.SetStateAction<Moderator[]>>;
    flag: number;
    room_id: number;
  };
};

const FALLBACK_MODS: Moderator[] = [
  {
    id: 1,
    username: localStorage.getItem("name") || "you",
    msg_count: 0,
    vote_count: 0,
  },
  {
    id: 2,
    username: "auto mod",
    msg_count: 0,
    vote_count: 0,
  },
  {
    id: 3,
    username: "semi auto mod",
    msg_count: 0,
    vote_count: 0,
  },
];

const Search = ({ value }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chosenMod, setChosenMode] = useState(false);
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pagination_limit = 5;
  const [availableModerators, setAvailableModerators] =
    useState<Moderator[]>(FALLBACK_MODS);

  const { moderator, setModerator, flag, room_id } = value;

  const getModOptions=async()=>{
    //func gets available mod options
    try{
      if(flag && flag>0){
        const resp2=await getStats(Number(room_id),searchQuery)
        if(resp2.status>200) throw new Error(resp2.data)
        setAvailableModerators(resp2.data)
      }
      else{
        setAvailableModerators(FALLBACK_MODS)
      }
    }catch(e:any){
      console.error(e)
    }
  }


  useEffect(() => {
    const handler=setTimeout(()=>{
      getModOptions()
    },400)

    return ()=>clearTimeout(handler)
  },[searchQuery])

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

  // const filteredMods =
  //   searchQuery.trim() === ""
  //     ? availableModerators
  //     : availableModerators.filter((mod) =>
  //         mod.username.toLowerCase().includes(searchQuery.toLowerCase())
  //       );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (chosenMod) setChosenMode(false);
    setSearchQuery(e.target.value);
    setDropDownStatus(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setDropDownStatus(false);
    }, 2000);
  };

  const removeModerator = (id: number) => {
    setModerator((prev) => prev.filter((mod) => mod.id !== id));
  };

  const handleSelect = (mod: Moderator) => {
    setModerator((prev) => {
      if (prev.some((existing) => existing.id === mod.id)) return prev;
      return [...prev, mod];
    });
    setSearchQuery(mod.username);
    setChosenMode(true);
    setDropDownStatus(false);
  };

  return (
    <div className="w-full md:w-2/3 relative" ref={containerRef}>
      <span className="font-semibold mb-3 block">Moderators</span>
      <div className="w-full flex flex-wrap gap-2 mt-2 mb-3">
        {moderator.length > 0 ? (
          moderator.map((mod) => (
            <div
              key={mod.id}
              className="group flex bg-red-200 rounded-3xl items-center px-2 py-1"
            >
              <div className="text-black">{mod.username}</div>
              <button
                onClick={() => removeModerator(mod.id)}
                className="hidden group-hover:inline text-sm ml-2 rounded-full"
              >
                ⛔
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No moderators selected</div>
        )}
      </div>

      <input
        className="w-full border border-gray-400 rounded px-3 py-2"
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        onClick={() => setDropDownStatus(true)}
        placeholder="Search moderator..."
      />

      {!chosenMod && dropDownStatus && availableModerators.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-40 overflow-y-auto">
          {availableModerators.slice(0, pagination_limit).map((mod) => (
            <div
              key={mod.id}
              onClick={(e) => {
                e.preventDefault();
                handleSelect(mod);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {`${mod.username}  Messages: ${mod.msg_count} Votes : ${mod.vote_count}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
