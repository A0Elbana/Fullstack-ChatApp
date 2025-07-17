// Import React hooks and custom stores
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore"; // Chat state management
import { useAuthStore } from "../store/useAuthStore"; // Auth/online users state
import SidebarSkeleton from "./skeletons/SidebarSkeleton"; // Loading skeleton for sidebar
import { Users } from "lucide-react"; // Icon component

// Sidebar component for listing chat users
const Sidebar = () => {
  // Destructure state and functions from chat store
  const {
    getUsers, // Function to fetch user list
    users, // Array of all users
    selectedUser, // Currently selected user for chat
    setSelectedUser, // Function to change selected user
    isUsersLoading, // Loading state for users
  } = useChatStore();

  // Get list of online users from auth store
  const { onlineUsers } = useAuthStore();

  // Local state to control the "Show online only" toggle
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // Fetch all users once when the component mounts
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users depending on the "Show online only" toggle
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  // If users are still loading, show a loading skeleton
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Top section with title and toggle filter */}
      <div className="border-b border-base-300 w-full p-5">
        {/* Title with icon */}
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* Toggle: Show only online users (visible on large screens only) */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            {/* Checkbox toggle */}
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>

          {/* Online users count (excluding self) */}
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* User list section */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)} // Select user on click
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300" // Highlight selected user
                  : ""
              }
            `}
          >
            {/* User avatar */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"} // Fallback if no image
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {/* Online status indicator */}
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User name and status (only on large screens) */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {/* Empty state if no users match the filter */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

// Export the Sidebar component
export default Sidebar;
