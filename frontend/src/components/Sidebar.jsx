// Importing the Zustand chat and auth store hook
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

// Skeleton loader for sidebar while users are loading
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

// React hook for side effects
import { useEffect } from "react";

// Icon from lucide-react library
import { Users } from "lucide-react";

// Sidebar component definition
const Sidebar = () => {
  // Destructure needed values/functions from Zustand store
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    isPfpLoading,
  } = useChatStore();

  // Temporary array for online users (will be implemented later)
  const { onlineUsers } = useAuthStore();

  // Debugging log (can be removed in production)
  console.log(users);

  // Run getUsers once when the component mounts
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // If users are loading, show skeleton loader
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 
      flex flex-col transition-all duration-200"
    >
      {/* Header section with title and icon */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* Optional: Toggle to filter only online users can be added here */}
      </div>

      {/* User list area */}
      <div className="overflow-y-auto w-full py-3">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)} // Set selected user when clicked
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
            {/* User avatar with online indicator */}
            <div className="relative mx-auto lg:mx-0">
              {isPfpLoading ? (
                <div className="size-12 shrink-0 rounded-full bg-gray-300 animate-pulse flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-500 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </div>
              ) : (
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
              )}

              {/* Online status indicator dot */}
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* Show user name and status only on large screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

// Export the Sidebar component for use in other parts of the app
export default Sidebar;
