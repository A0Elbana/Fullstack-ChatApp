// Importing the message icon from lucide-react
import { MessageSquare } from "lucide-react";

// Component to show when no chat is selected
const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Animated Icon */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Title Text */}
        <h2 className="text-2xl font-bold">Welcome to Chattify!</h2>

        {/* Instructional Text */}
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
