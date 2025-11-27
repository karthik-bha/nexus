// src/context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // console.log("🔵 Creating socket with token:", token);

    const s = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["polling", "websocket"],
      auth: { token },
      reconnection: true,
      timeout: 10000,
    });

    s.on("connect", () => {
      // console.log("🟢 SOCKET CONNECTED!", s.id);
      setConnected(true);
    });

    s.on("connect_error", (err) => {
      console.error("CONNECT ERROR:", err.message);
    });

    s.on("disconnect", () => {
      // console.log("⚪ SOCKET DISCONNECTED");
      setConnected(false);
    });

    setSocket(s);

    return () => {
      // console.log("🟡 Cleaning up socket");
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
