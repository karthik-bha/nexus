import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSocket } from "./SocketContext";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { socket, connected } = useSocket();
  const [totalUnread, setTotalUnread] = useState(0);

  // Stable unread fetcher
  const fetchUnread = useCallback(async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const data = await resp.json();
      const sum = data.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
      setTotalUnread(sum);
    } catch (e) {
      console.error("Failed to load unread", e);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchUnread();
  }, [fetchUnread]);

  // Stable handler for socket
  const handleChatUpdated = useCallback(() => {
    fetchUnread();
  }, [fetchUnread]);

  useEffect(() => {
    if (!socket || !connected) return;

    socket.on("chat-updated", handleChatUpdated);

    return () => {
      socket.off("chat-updated", handleChatUpdated);
    };
  }, [socket, connected, handleChatUpdated]);

  return (
    <ChatContext.Provider value={{ totalUnread, fetchUnread }}>
      {children}
    </ChatContext.Provider>
  );
};
