// Define a React functional component named AuthImagePattern
// It receives props: title and subtitle
const AuthImagePattern = ({ title, subtitle }) => {
  return (
    // Main container (hidden on small screens, flex layout on large screens)
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      {/* Inner content container with max width and centered text */}
      <div className="max-w-md text-center">
        {/* Decorative grid of 9 blocks (3 columns with spacing) */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {/* Generate an array of 9 elements and map through them */}
          {[...Array(9)].map((_, i) => (
            // Each grid item (square block)
            <div
              key={i} // Unique key based on index (required for list rendering)
              // Tailwind classes:
              // - Make it a square using aspect ratio
              // - Rounded corners
              // - Semi-transparent background
              // - Add pulse animation only to even-numbered blocks
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>

        {/* Title text coming from props */}
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {/* Subtitle text with faded color */}
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

// Export the component so it can be used in other files
export default AuthImagePattern;
