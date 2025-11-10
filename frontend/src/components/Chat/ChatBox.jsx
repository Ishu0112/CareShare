import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../utils/SocketProvider";
import { useUser } from "../utils/UserProvider";
import { useAlert } from "../utils/AlertProvider";
import { useLoading } from "../utils/LoadingProvider";
import Axios from "axios";
import PageHeading from "../utils/PageHeading";

export default function ChatBox() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { userData: user, setUserData } = useUser();
  const { setAlert } = useAlert();
  const { setIsLoading } = useLoading();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const hasFetchedUser = useRef(false);

  // Fetch current user if not loaded
  useEffect(() => {
    async function fetchUserIfNeeded() {
      // Check if user is not loaded and we haven't tried fetching yet
      if ((!user || !user._id || user._id === "") && !hasFetchedUser.current) {
        console.log("ChatBox: User not loaded, fetching profile...");
        hasFetchedUser.current = true; // Prevent multiple fetches

        try {
          const response = await Axios.get(
            `${import.meta.env.VITE_BACKEND_URL}user/profile`
          );
          if (response.status === 200) {
            console.log("ChatBox: User profile fetched:", response.data);
            setUserData({
              ...user,
              ...response.data,
            });
          }
        } catch (error) {
          console.error("ChatBox: Error fetching user:", error);
          setError("Please login to use chat");
          setAlert({
            message: "Please login to use chat",
            type: "error",
          });
          setTimeout(() => navigate("/user/login"), 2000);
        }
      }
    }
    fetchUserIfNeeded();
  }, []); // Empty dependency array - only run once on mount

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat
  useEffect(() => {
    async function initializeChat() {
      console.log("ChatBox: Initializing chat...", { userId, user });

      if (!userId) {
        console.error("ChatBox: No userId in URL params");
        setAlert({
          message: "Invalid chat user",
          type: "error",
        });
        navigate("/user/matches");
        return;
      }

      if (!user || !user._id) {
        console.log("ChatBox: Waiting for user to load...");
        return;
      }

      setIsLoading(true);
      try {
        console.log("ChatBox: Creating/getting chat with user:", userId);

        // Create or get chat
        const response = await Axios.post(
          `${import.meta.env.VITE_BACKEND_URL}chat/create`,
          { participantId: userId }
        );

        console.log("ChatBox: Chat response:", response);

        if (response.status === 200) {
          setChat(response.data);
          setMessages(response.data.messages || []);

          // Find the other user
          const other = response.data.participants.find(
            (p) => p._id !== user._id
          );
          setOtherUser(other);

          console.log("ChatBox: Chat initialized successfully", {
            chatId: response.data._id,
            otherUser: other,
          });

          // Join socket room
          if (socket && isConnected) {
            socket.emit("join-room", response.data._id);
            console.log("ChatBox: Joined socket room:", response.data._id);
          } else {
            console.warn("ChatBox: Socket not connected yet");
          }
        }
      } catch (error) {
        console.error("ChatBox: Error initializing chat:", error);
        console.error("ChatBox: Error response:", error.response?.data);
        setAlert({
          message: error.response?.data?.error || "Error loading chat",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }

    initializeChat();
  }, [userId, user, socket, isConnected]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket || !chat || !user) return;

    const handleReceiveMessage = (data) => {
      if (data.roomId === chat._id) {
        // Only add message if it's from another user (not echo of our own message)
        const senderId = data.message.sender._id || data.message.sender;
        if (senderId !== user._id) {
          setMessages((prev) => [...prev, data.message]);
        }
      }
    };

    const handleUserTyping = (data) => {
      if (data.roomId === chat._id && data.userId !== user._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("user-typing", handleUserTyping);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("user-typing", handleUserTyping);
    };
  }, [socket, chat, user]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !chat) return;

    const messageContent = input.trim();
    setInput("");

    try {
      // Save to database
      const response = await Axios.post(
        `${import.meta.env.VITE_BACKEND_URL}chat/${chat._id}/message`,
        { content: messageContent }
      );

      if (response.status === 200) {
        const newMessage = response.data;

        // Emit to socket for real-time delivery to other user
        socket.emit("send-message", {
          roomId: chat._id,
          message: newMessage,
        });

        // Add to local state immediately (don't wait for socket echo)
        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setAlert({
        message: "Failed to send message",
        type: "error",
      });
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!socket || !chat) return;

    socket.emit("typing", {
      roomId: chat._id,
      userId: user._id,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      // Could emit stop-typing event here
    }, 1000);
  };

  if (!chat || !otherUser) {
    if (error) {
      return (
        <div className="flex justify-center items-center min-h-96">
          <div className="text-red-600 dark:text-red-400 text-center">
            <div className="mb-4 text-xl">⚠️ {error}</div>
            <div className="text-sm">Redirecting to login...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-gray-900 dark:text-white text-center">
          <div className="mb-4 text-lg">Loading chat...</div>
          {!user?._id && (
            <div className="text-sm text-gray-500">
              Waiting for user authentication...
            </div>
          )}
          {user?._id && !chat && (
            <div className="text-sm text-gray-500">Creating chat room...</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen py-5">
      <div className="max-w-4xl w-full flex flex-col h-[80vh]">
        <PageHeading>Chat with {otherUser.name}</PageHeading>

        <div className="flex-1 flex flex-col border-2 border-blue-600 dark:border-blue-500 rounded-lg shadow bg-slate-200 dark:bg-gray-900 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-blue-600 dark:bg-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/user/matches")}
                className="hover:bg-blue-700 dark:hover:bg-blue-800 rounded-full p-2 transition"
              >
                ← Back
              </button>
              <div>
                <h3 className="font-semibold">{otherUser.name}</h3>
                <p className="text-sm text-blue-100">@{otherUser.username}</p>
              </div>
            </div>
            <div className="text-sm">
              {isConnected ? (
                <span className="text-green-300">● Online</span>
              ) : (
                <span className="text-gray-300">○ Offline</span>
              )}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg, idx) => {
                // Check if current user is the sender
                const senderId = msg.sender?._id || msg.sender;
                const isSender = senderId === user._id;

                // Debug logging
                console.log("Message:", {
                  content: msg.content,
                  senderId,
                  currentUserId: user._id,
                  isSender,
                });

                return (
                  <div
                    key={idx}
                    className={`flex ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isSender
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white"
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg">
                  <span className="italic text-sm">typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Container */}
          <div className="border-t-2 border-blue-600 dark:border-blue-500 p-4 bg-slate-100 dark:bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  handleTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevent default form submission
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
