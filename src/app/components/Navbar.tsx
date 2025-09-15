import React from "react";
import NavbarItem from "./NavbarItem";

const Navbar = () => {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-center px-6 py-3 backdrop-blur-md bg-black/10 dark:bg-white/5"
      style={{
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex gap-6">
        <NavbarItem title="Trending" param="trending" />
        <NavbarItem title="Top Rated" param="rated" />
      </div>
    </nav>
  );
};

export default Navbar;
