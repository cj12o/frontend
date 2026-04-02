import { useMemo } from "react";

import WebSocketContextProvider from "./WebSocketProvider";
import Room from "./Room";
import { useParams } from "react-router-dom";

const RoomWrapper = () => {
  const { id } = useParams()
  if (!id) return null
  const provider = useMemo(
    () => (
      <WebSocketContextProvider id={id}>
        <Room />
      </WebSocketContextProvider>
    ),
    [id],
  )
  return provider
};

export default RoomWrapper;
