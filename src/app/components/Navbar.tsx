import React from 'react';
import NavbarItem from './NavbarItem';
const Navbar = () => {
  return (
    <div className="flex items-center justify-center space-x-2 py-6">
      <div className="bg-white/5 backdrop-blur-lg rounded-full p-2 border border-white/10">
        <div className="flex items-center space-x-1">
          <NavbarItem title="Trending" param="trending" />
          <NavbarItem title="Top Rated" param="rated" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
