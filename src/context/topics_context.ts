import { createContext, useContext } from "react";
import { type TopicType } from "@/types/Room.type";

export type TopicContextType = {
  topics: TopicType[];
  setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>;
};

export const TopicContext = createContext<TopicContextType | null>(null);

export const useTopicContext = () => {
  const context = useContext(TopicContext);
  if (!context) {
    throw new Error("useTopicContext must be used as useTopicContext");
  }
  return context;
};
