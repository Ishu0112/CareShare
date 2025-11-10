import maleAvatar from "../../../assets/avatar/male-default-avatar.png";
import { useNavigate, useParams } from "react-router-dom";

export default function UserListItem({ user }) {
  const navigate = useNavigate();

  function handleViewProfile() {
    navigate(`/${user.username}`);
  }

  function handleStartChat(e) {
    e.stopPropagation(); // Prevent triggering parent click
    console.log("UserListItem: Starting chat with user:", user);
    console.log("UserListItem: User ID:", user._id);

    if (!user._id) {
      console.error("UserListItem: User._id is undefined!", user);
      alert("Cannot start chat - user ID not found");
      return;
    }

    navigate(`/chat/${user._id}`);
  }

  return (
    <li className="px-3 py-3 sm:py-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
      <div className="flex items-center space-x-4 justify-between">
        <div
          className="flex items-center space-x-4 flex-1"
          onClick={handleViewProfile}
        >
          <div className="flex-shrink-0">
            <img
              className="w-8 h-8 rounded-full"
              src={maleAvatar}
              alt={`avatar`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 truncate dark:text-gray-400">{`@ ${user.username}`}</p>
          </div>
        </div>
        <button
          onClick={handleStartChat}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition duration-200 flex items-center gap-2"
        >
          💬 Chat
        </button>
      </div>
    </li>
  );
}
