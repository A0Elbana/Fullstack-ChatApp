import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, X } from "lucide-react";

// ProfilePage component for displaying and updating user profile
const ProfilePage = () => {
  // Accessing state and actions from the auth store
  const authUser = useAuthStore((state) => state.authUser);
  const isUpdatingProfile = useAuthStore((state) => state.isUpdatingProfile);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [selectedImg, setSelectedImg] = useState(null); // Holds selected image data

  // When authUser changes, update selected image if profilePic exists
  useEffect(() => {
    if (authUser?.profilePic) {
      setSelectedImg(authUser.profilePic);
    }
  }, [authUser?.profilePic]);

  // Handle image file upload and update profile picture
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
    reader.readAsDataURL(file); // Convert image to base64
  };

  // Remove the current profile image
  const handleImageRemove = async () => {
    setSelectedImg(null);
    await updateProfile({ profilePic: null });
  };

  // Show loading if authUser isn't loaded yet
  if (!authUser) {
    return (
      <div className="h-screen flex items-center justify-center text-zinc-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar upload and preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* Display profile image */}
              <img
                src={selectedImg || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />

              {/* Upload button */}
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>

              {/* Remove image button */}
              <button
                onClick={handleImageRemove}
                disabled={isUpdatingProfile}
                className={`
                  absolute bottom-0 left-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                  ${selectedImg ? "block" : "hidden"}
                  cursor-pointer
                `}
              >
                <X className="w-5 h-5 text-base-200" />
              </button>
            </div>

            {/* Upload status */}
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Basic user info */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser.email}
              </p>
            </div>
          </div>

          {/* Additional account information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                  {new Date(authUser.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
