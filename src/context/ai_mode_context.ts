import { createContext, useContext } from "react";

type AIModeContextType = {
  aiStatus: boolean;
  setAiStatus: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AIModeContext = createContext<AIModeContextType | null>(null);

export const useAIModeContext = () => {
  const context = useContext(AIModeContext);
  if (!context) {
    throw new Error("useAIModeContext must be used within an AIModeContextProvider");
  }
  return context;
};
