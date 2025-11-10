import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../utils/AlertProvider";
import { useLoading } from "../utils/LoadingProvider";
import { useUser } from "../utils/UserProvider";
import PageHeading from "../utils/PageHeading";
import Axios from "axios";
import maleAvatar from "../../assets/avatar/male-default-avatar.png";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const { setAlert } = useAlert();
  const { setIsLoading } = useLoading();
  const { userData: user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChats() {
      setIsLoading(true);
      try {
        const response = await Axios.get(
          `${import.meta.env.VITE_BACKEND_URL}chat/`
        );

        if (response.status === 200) {
          setChats(response.data);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        setAlert({
          message: "Error loading chats",
          type: "error",
        });
      }
      setIsLoading(false);
    }

    fetchChats();
  }, []);

  const handleChatClick = (chat) => {
    // Find the other user in the chat
    const otherUser = chat.participants.find((p) => p._id !== user._id);
    if (otherUser) {
      navigate(`/chat/${otherUser._id}`);
    }
  };

  return (
    <div className="flex item-center justify-center w-full min-h-96">
      <div className="max-w-xl flex flex-col my-5">
        <PageHeading>Messages</PageHeading>
        <div className="w-full min-w-64 border-2 border-blue-600 dark:border-blue-500 rounded-lg shadow mb-5 p-5 overflow-hidden bg-slate-200 dark:bg-gray-900">
          <ul className="min-w-96 divide-y divide-gray-200 dark:divide-gray-700">
            {chats.length > 0 ? (
              chats.map((chat, index) => {
                const lastMessage = chat.messages[chat.messages.length - 1];
                const otherUser = chat.participants.find(
                  (p) => p._id !== user._id
                );
                const otherUserName = otherUser
                  ? `${otherUser.fname} ${otherUser.lname}`
                  : "Unknown User";

                return (
                  <li
                    key={index}
                    onClick={() => handleChatClick(chat)}
                    className="px-3 py-3 sm:py-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="w-12 h-12 rounded-full"
                          src={maleAvatar}
                          alt="avatar"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {otherUserName}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {lastMessage?.content || "No messages yet"}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {lastMessage &&
                          new Date(lastMessage.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <div className="text-gray-900 dark:text-white">
                <li className="text-center py-4">No chats yet</li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
