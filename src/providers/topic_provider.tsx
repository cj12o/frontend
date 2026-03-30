import { useState } from "react";
import { TopicContext} from "@/context/topics_context";
import { type TopicType } from "@/types/Room.type";

export const TopicProvider = ({ children }: { children: React.ReactNode }) => {
  const [topics, setTopics] = useState<TopicType[]>([]);

  return (
    <TopicContext.Provider value={{ topics, setTopics }}>
      {children}
    </TopicContext.Provider>
  );
};