// Import Zustand for state management
import { create } from "zustand";

// Create a Zustand store to manage the application's theme
export const useThemeStore = create((set) => ({
    // Current theme (defaults to 'coffee' if not set in localStorage)
    theme: localStorage.getItem("chat-theme") || "coffee",

    /**
     * Set a new theme and persist it in localStorage
     * @param {string} theme - The theme name to set (e.g., "light", "dark", "coffee", etc.)
     */
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme); // Save to localStorage
        set({ theme }); // Update Zustand store
    },
}));
