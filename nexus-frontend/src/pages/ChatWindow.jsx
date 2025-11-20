import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/socketContext";


const ChatWindow = () => {
    const { chatId } = useParams();
    const { socket, connected } = useSocket();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [chatUser, setChatUser] = useState(null);

    const currentUserId = localStorage.getItem("userId");
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState({});
    const typingTimeoutRef = useRef(null);

    const messagesEndRef = useRef(null);
    // -----------------------------------------
    // 1) Load chat partner info for header
    // -----------------------------------------
    useEffect(() => {
        const loadChatUser = async () => {
            try {
                const resp = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/chat/details/${chatId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const data = await resp.json();
                setChatUser(data);
            } catch (err) {
                console.error("Failed to load chat user:", err);
            }
        };

        loadChatUser();
    }, [chatId]);
    // Load old chat messages
    useEffect(() => {
        const loadMessages = async () => {
            try {
                const resp = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/chat/${chatId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                const data = await resp.json();
                setMessages(data);
            } catch (err) {
                console.error("Failed to load messages:", err);
            }
        };

        loadMessages();
    }, [chatId]);


    // Join room
    useEffect(() => {
        if (!socket || !connected) return;

        socket.emit("join-chat", chatId);
        console.log("Joined chat:", chatId);

        return () => {
            socket.emit("leave-chat", chatId);
        };
    }, [socket, connected, chatId]);


    // Listen for incoming messages
    useEffect(() => {
        if (!socket || !connected) return;

        const handler = (msg) => {
            if (msg.chatId === chatId) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("receive-message", handler);

        return () => socket.off("receive-message", handler);
    }, [socket, connected, chatId]);


    // Auto scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    // Auto scroll when messages OR typing indicator changes
    useEffect(() => {
        scrollToBottom();
    }, [messages, typingUsers]);

    useEffect(() => {
        async function loadChatUser() {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/details/${chatId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await resp.json();
            setChatUser(data);
        }
        loadChatUser();
    }, [chatId]);
    useEffect(() => {
        if (!socket) return;

        const handleTyping = ({ userId }) => {
            if (userId === currentUserId) return;

            setTypingUsers((prev) => ({ ...prev, [userId]: true }));
        };

        const handleStopTyping = ({ userId }) => {
            setTypingUsers((prev) => {
                const updated = { ...prev };
                delete updated[userId];
                return updated;
            });
        };

        socket.on("typing", handleTyping);
        socket.on("stop-typing", handleStopTyping);

        return () => {
            socket.off("typing", handleTyping);
            socket.off("stop-typing", handleStopTyping);
        };
    }, [socket]);


    const handleSend = () => {
        if (!input.trim()) return;
        if (!socket || !connected) {
            console.warn("Socket not ready");
            return;
        }

        socket.emit("send-message", {
            chatId,
            content: input
        });

        setInput("");
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);

        if (socket && chatId) {
            socket.emit("typing", { chatId });

            clearTimeout(typingTimeoutRef.current);

            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stop-typing", { chatId });
            }, 1000);
        }
    };







    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col">
            {/* CHAT HEADER */}
            <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center gap-3
                sticky top-0 z-20">
                <img
                    src={chatUser?.profile_picture || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="pfp"
                />
                <div className="flex flex-col">
                    <p className="font-medium text-gray-100 text-lg">
                        {chatUser?.username || "Loading..."}
                    </p>
                    <p className="text-xs text-gray-500">Direct Message</p>
                </div>
            </div>


            {/* MESSAGE LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;

                    return (
                        <div
                            key={msg.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm shadow 
                    ${isMe
                                        ? "bg-gray-200 text-black rounded-br-none"
                                        : "bg-neutral-800 text-gray-200 border border-neutral-700 rounded-bl-none"
                                    }`}
                            >
                                <p>{msg.content}</p>
                                <p className="text-[10px] text-gray-500 mt-1 text-right">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    );
                })}

                <div ref={messagesEndRef} />
            </div>

            {/* TYPING INDICATOR - OUTSIDE SCROLL AREA */}
            {Object.keys(typingUsers).length > 0 && (
                <div className="px-4 pb-2">
                    <div className="inline-flex items-center gap-1 bg-neutral-800 border border-neutral-700 px-3 py-2 rounded-xl shadow">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                    </div>
                </div>
            )}



            {/* Input bar */}
            <div className="px-4 py-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-3">

                <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Message..."
                    className="w-full bg-neutral-800 border border-neutral-700 text-gray-200 px-4 py-2 rounded-xl"
                />
                <button
                    onClick={handleSend}
                    className="bg-gray-200 text-black px-4 py-2 rounded-xl"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
