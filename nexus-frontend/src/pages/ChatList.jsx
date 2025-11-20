import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "../context/socketContext";

const ChatList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, connected } = useSocket();

  const currentUserId = localStorage.getItem("userId");

  const [chats, setChats] = useState([]);
  const [unread, setUnread] = useState({});

  // Helper: sort chats by last message
  const sortChats = (list) =>
    [...list].sort(
      (a, b) =>
        new Date(b.lastMessageTimestamp || 0) -
        new Date(a.lastMessageTimestamp || 0)
    );

  // Load initial chat list
  useEffect(() => {
    const loadChats = async () => {
      try {
        const resp = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/chat/list`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await resp.json();
        setChats(sortChats(data));
      } catch (e) {
        console.error("Failed to load chats", e);
      }
    };

    loadChats();
  }, []);

  // Determine which chat page the user is viewing
  const activeChatId = useMemo(() => {
    const match = location.pathname.match(/\/chat\/(.+)/);
    return match ? match[1] : null;
  }, [location.pathname]);

  // Socket listener for chat-updated
  useEffect(() => {
    if (!socket || !connected) return;

    const handleChatUpdate = ({ chatId, lastMessage, lastMessageTimestamp }) => {
      // Update chat preview list
      setChats((prev) => {
        const updated = prev.map((c) =>
          c.chatId === chatId
            ? { ...c, lastMessage, lastMessageTimestamp }
            : c
        );
        return sortChats(updated);
      });

      // Unread handling:
      // Only mark as unread IF:
      // - The message is NOT from the user
      // - The user is NOT in that chat window
      if (activeChatId !== chatId) {
        setUnread((prev) => ({ ...prev, [chatId]: true }));
      }
    };

    socket.on("chat-updated", handleChatUpdate);
    return () => socket.off("chat-updated", handleChatUpdate);

  }, [socket, connected, activeChatId]);

  const openChat = (chatId) => {
    setUnread((prev) => ({ ...prev, [chatId]: false }));
    navigate(`/chat/${chatId}`);
  };

  return (
    <section className="min-h-screen bg-neutral-950 text-gray-100 px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Messages</h1>

      {chats.length === 0 ? (
        <p className="text-gray-500 text-center mt-20 italic">
          No conversations yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4 max-w-[600px] mx-auto">
          {chats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => openChat(chat.chatId)}
              className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl hover:bg-neutral-800 cursor-pointer transition"
            >
              <img
                src={chat.otherUserPfp || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                className="w-12 h-12 rounded-full object-cover"
                alt="pfp"
              />

              <div className="flex-1">
                <p className="font-medium text-gray-100 text-lg">
                  {chat.otherUserUsername}
                </p>

                <p className="text-gray-400 text-sm truncate w-[250px]">
                  {chat.lastMessage || "No messages yet"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {chat.lastMessageTimestamp
                    ? new Date(chat.lastMessageTimestamp).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )
                    : ""}
                </p>
              </div>

              {unread[chat.chatId] && (
                <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full ml-2">
                  NEW
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ChatList;
