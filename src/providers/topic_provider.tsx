import { useState } from "react";
import { TopicContext } from "@/context/topics_context";
import { type TopicType } from "@/types/Room.type";

export const TopicContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [topics, setTopics] = useState<TopicType[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("all");

  return (
    <TopicContext.Provider
      value={{ topics, setTopics, selectedTopic, setSelectedTopic }}
    >
      {children}
    </TopicContext.Provider>
  );
};
