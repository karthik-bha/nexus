import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "../context/socketContext";
import apiWrapper from "../api-wrapper/api";

const ChatList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, connected } = useSocket();

  const currentUserId = localStorage.getItem("userId");

  const [chats, setChats] = useState([]);
  const [unread, setUnread] = useState({});

  // Sort helper
  const sortChats = useCallback(
    (list) =>
      [...list].sort(
        (a, b) =>
          new Date(b.lastMessageTimestamp || 0) -
          new Date(a.lastMessageTimestamp || 0)
      ),
    []
  );

  // Load chats initially
  const loadChats = useCallback(async () => {
    try {
      const resp = await apiWrapper(`/chat/list`, {
        method: "GET",
      });

      const data = await resp.json();
      setChats(sortChats(data));

      const unreadObj = {};
      data.forEach((c) => (unreadObj[c.chatId] = c.unreadCount || 0));
      setUnread(unreadObj);
    } catch (e) {
      console.error("Failed to load chats", e);
    }
  }, [sortChats]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Only reload chats partially (for unread count)
  const refreshChats = useCallback(async () => {
    try {
      const resp = await apiWrapper(`/chat/list`, {
        method: "GET",
      });

      const data = await resp.json();
      setChats(sortChats(data));

      const unreadObj = {};
      data.forEach((c) => (unreadObj[c.chatId] = c.unreadCount || 0));
      setUnread(unreadObj);
    } catch (e) {
      console.error("Failed to refresh chats", e);
    }
  }, [sortChats]);

  // Detect active chat
  const activeChatId = useMemo(() => {
    const match = location.pathname.match(/\/chat\/(.+)/);
    return match ? match[1] : null;
  }, [location.pathname]);

  // Socket handler
  const handleChatUpdate = useCallback(
    async ({ chatId, lastMessage, lastMessageTimestamp }) => {
      // Instant UI update
      setChats((prev) => {
        const updated = prev.map((c) =>
          c.chatId === chatId
            ? { ...c, lastMessage, lastMessageTimestamp }
            : c
        );
        return sortChats(updated);
      });

      // If not currently viewing chat -> mark unread
      if (activeChatId !== chatId) {
        setUnread((prev) => ({
          ...prev,
          [chatId]: (prev[chatId] || 0) + 1,
        }));
      }

      // Sync with backend (gets real unreadCount)
      refreshChats();
    },
    [activeChatId, refreshChats, sortChats]
  );

  // Bind socket listener
  useEffect(() => {
    if (!socket || !connected) return;

    socket.on("chat-updated", handleChatUpdate);

    return () => socket.off("chat-updated", handleChatUpdate);
  }, [socket, connected, handleChatUpdate]);

  // When opening chat -> mark as read backend
  const openChat = async (chatId) => {
    try {
      await apiWrapper(`/chat/mark-read/${chatId}`, { method: "POST" });

      // Reset unread locally
      setUnread((prev) => ({ ...prev, [chatId]: 0 }));
    } catch (err) {
      console.error("Failed to mark read", err);
    }

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
                src={
                  chat.otherUserPfp ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
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

              {unread[chat.chatId] > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full ml-2">
                  {unread[chat.chatId]}
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
