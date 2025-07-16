// Import the X icon from lucide-react library
import { X } from "lucide-react";

// Import custom hooks for authentication and chat state
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

// Define the ChatHeader component
const ChatHeader = () => {
  // Destructure selected user and setter function from chat store
  const { selectedUser, setSelectedUser } = useChatStore();

  // Get list of online users from auth store
  const { onlineUsers } = useAuthStore();

  // JSX return block
  return (
    <div className="p-2.5 border-b border-base-300">
      {" "}
      {/* Header container with padding and bottom border */}
      <div className="flex items-center justify-between">
        {" "}
        {/* Flex container for spacing between avatar and close button */}
        {/* Left side: User avatar and info */}
        <div className="flex items-center gap-3">
          {" "}
          {/* Flex row with spacing between avatar and text */}
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {" "}
              {/* Fixed size, rounded avatar */}
              <img
                src={selectedUser.profilePic || "/avatar.png"} // Use profile picture or fallback image
                alt={selectedUser.fullName} // Alt text for accessibility
              />
            </div>
          </div>
          {/* User information */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>{" "}
            {/* User's full name */}
            <p className="text-sm text-base-content/70">
              {/* Show Online/Offline based on user's status */}
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        {/* Right side: Close chat button */}
        <button onClick={() => setSelectedUser(null)}>
          {" "}
          {/* Clear selected user on click */}
          <X /> {/* X icon from lucide-react */}
        </button>
      </div>
    </div>
  );
};

// Export the component for use in other files
export default ChatHeader;
