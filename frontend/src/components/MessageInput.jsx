// Import necessary hooks and utilities
import { useChatStore } from "../store/useChatStore";
import { useState, useRef } from "react";
import { Image, X, Send } from "lucide-react"; // Icons
import { toast } from "react-hot-toast"; // For user notifications

// Define the MessageInput component
const MessageInput = () => {
  // State to store the message text
  const [text, setText] = useState("");

  // State to hold the selected image preview (Base64)
  const [imagePreview, setImagePreview] = useState(null);

  // Reference to the hidden file input
  const fileInputRef = useRef(null);

  // Destructure the sendMessage function from the store
  const { sendMessage } = useChatStore();

  // Function triggered when user selects an image
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file selected

    // Check if the selected file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Use FileReader to convert image to Base64 string
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result); // Store preview in state
    };
    reader.readAsDataURL(file); // Convert image to Base64
  };

  // Remove selected image
  const removeImage = () => {
    setImagePreview(null); // Clear preview
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  // Handle sending the message
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent form default behavior

    // Don't send if both text and image are empty
    if (!text.trim() && !imagePreview) return;

    try {
      // Send message with text and optional image
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear input fields
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!"); // Show error toast
    }
  };

  return (
    <div className="p-4 w-full">
      {" "}
      {/* Container with padding */}
      {/* Image preview section (if an image is selected) */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          {" "}
          {/* Margin bottom and horizontal spacing */}
          <div className="relative">
            {" "}
            {/* Needed for absolute X button */}
            <img
              src={imagePreview} // Preview image source
              alt="Preview" // Alt text
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage} // Remove image on click
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" /> {/* Small X icon */}
            </button>
          </div>
        </div>
      )}
      {/* Form for text input and send button */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {" "}
          {/* Takes all available width */}
          {/* Text input field */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)} // Update text state
          />
          {/* Hidden file input for image upload */}
          <input
            type="file"
            accept="image/*" // Only allow image files
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          {/* Image upload button (visible only on larger screens) */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
              ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()} // Trigger file input click
          >
            <Image size={20} /> {/* Image icon */}
          </button>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview} // Disable if both are empty
        >
          <Send size={22} /> {/* Send icon */}
        </button>
      </form>
    </div>
  );
};

// Export the component
export default MessageInput;
