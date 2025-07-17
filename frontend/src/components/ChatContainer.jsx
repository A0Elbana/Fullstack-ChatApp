// Import hooks and components from local files and libraries
import { useChatStore } from "../store/useChatStore"; // Custom hook for chat-related state
import { useEffect, useRef } from "react";
import MessageSkeleton from "./skeletons/MessageSkeleton"; // Loading skeleton for messages
import ChatHeader from "./ChatHeader"; // Chat header component
import MessageInput from "./MessageInput"; // Input component for sending messages
import { useAuthStore } from "../store/useAuthStore"; // Custom hook for authentication state

// Define the ChatContainer component
const ChatContainer = () => {
  // Destructure values from chat store
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToNewMessage,
    unsubscribeFromNewMessage,
  } = useChatStore();

  // Get the currently authenticated user
  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null); // Ref to scroll to the bottom message

  // Fetch messages when selectedUser changes and has a valid _id
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id); // Load messages for selected user
      subscribeToNewMessage(); // Subscribe to real-time new messages
    }

    return () => {
      unsubscribeFromNewMessage(); // Cleanup subscription on unmount or change
    };
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToNewMessage,
    unsubscribeFromNewMessage,
  ]); // Dependencies for the effect

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // If messages are loading, show skeleton UI
  if (isMessagesLoading)
    return (
      <div>
        <ChatHeader /> {/* Chat header while loading */}
        <MessageSkeleton /> {/* Skeleton loader for messages */}
        <MessageInput /> {/* Message input remains visible */}
      </div>
    );

  // Render the full chat UI when not loading
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader /> {/* Static chat header at the top */}
      {/* Scrollable container for all messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Loop through each message */}
        {messages.map((message) => (
          <div
            key={message._id} // Unique key for each message (required by React)
            // Align message left or right depending on sender
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            {/* Avatar section */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  // Display profile picture based on sender (authUser or selectedUser)
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "avatar.png"
                      : selectedUser.profilePic || "avatar.png"
                  }
                  alt="pfp" // Profile picture fallback alt text
                />
              </div>
            </div>

            {/* Timestamp header for each message */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {new Date(message.createdAt).toLocaleTimeString()}{" "}
                {/* Format message time */}
              </time>
            </div>

            {/* Message content container (text/image) */}
            <div className="chat-bubble flex flex-col">
              {/* If there's an image in the message, display it */}
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}

              {/* If there's text in the message, show it */}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}

        {/* Invisible element to scroll into view at the bottom */}
        <div ref={messageEndRef} />
      </div>
      {/* Input component for sending new messages */}
      <MessageInput />
    </div>
  );
};

// Export the component so it can be used elsewhere
export default ChatContainer;
