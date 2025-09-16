import React from "react";
import NavbarItem from "./NavbarItem";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-40 w-full">
      {/* Background with blur */}
      <div
        className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
        style={{
          background: "linear-gradient(to bottom, var(--background)/90, var(--background)/95)",
        }}
      >
        {/* Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4">
            {/* Navigation pills with glow */}
            <div
              className="flex items-center rounded-full p-1.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] dark:hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              style={{
                backgroundColor: "var(--background)", // Localized background
                border: `1px solid var(--border)`, // Localized border
              }}
            >
              <NavbarItem title="Trending" param="trending" />
              <NavbarItem title="Top Rated" param="rated" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
