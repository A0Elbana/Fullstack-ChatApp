// Import Zustand chat store to access selected user
import { useChatStore } from "../store/useChatStore";

// Import layout components
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

// Define the HomePage component
const HomePage = () => {
  // Extract the currently selected user from the chat store
  const { selectedUser } = useChatStore();

  return (
    // Main page container with full screen height and background
    <div className="h-screen bg-base-200">
      {/* Center content vertically and horizontally with padding */}
      <div className="flex items-center justify-center pt-20 px-4">
        {/* Main chat card container with max width and height adjustment */}
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          {/* Inner flex container to arrange sidebar and chat panel side by side */}
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Left sidebar component that shows contacts */}
            <Sidebar />

            {/* Conditionally render either the welcome message or chat container */}
            {!selectedUser ? (
              // If no user is selected, show a welcome/empty chat screen
              <NoChatSelected />
            ) : (
              // If a user is selected, show the main chat area
              <ChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the HomePage component to be used in routing or main layout
export default HomePage;
