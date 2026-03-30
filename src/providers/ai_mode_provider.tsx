import { useState } from "react";
import { AIModeContext } from "@/context/ai_mode_context";

export const AIModeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [aiStatus, setAiStatus] = useState(false);

  return (
    <AIModeContext.Provider value={{ aiStatus, setAiStatus }}>
      {children}
    </AIModeContext.Provider>
  );
};
