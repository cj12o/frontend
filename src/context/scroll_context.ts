import { createContext,useContext } from "react";



type ScrollContextType={
    lastScrollRef:number,
    hideHeader:boolean
    setHideHeader:React.Dispatch<React.SetStateAction<boolean>>
}

export const ScrollContext=createContext<ScrollContextType | null>(null);

export const useScrollContext=()=>{
    const context=useContext(ScrollContext);
    if(!context){
        throw new Error("useScrollContext must be used within a ScrollContextProvider");
    }
    return context
}    