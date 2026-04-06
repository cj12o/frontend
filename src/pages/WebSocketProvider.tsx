import React, { useMemo } from "react";
import { createContext} from "react";
import useWebSocket from "react-use-websocket";

const WebSocketContext = createContext<any>(null);

const websocketUrlbase=import.meta.env.VITE_WEBSOCKET_URL || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/`

const WebSocketContextProvider = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const url = useMemo(() => {
    return websocketUrlbase+`chat/${id}/?token=${localStorage.getItem("cookie") || ""}`;
  }, [id]);

  const { sendMessage, lastJsonMessage } = useWebSocket(url, {
    shouldReconnect: () => false,
  });

  const value = useMemo(() => {
    return { sendMessage, lastJsonMessage };
  }, [sendMessage, lastJsonMessage]);

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContextProvider;
export { WebSocketContext };
