import { useState } from "react";
import { RoomContext } from "@/context/room_context";
import { type RoomType } from "@/types/Room.type";

export const RoomContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [rooms, setRooms] = useState<RoomType[]>([]);

  return (
    <RoomContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomContext.Provider>
  );
};
