'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavbarItemProps {
  title: string;
  param: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ title, param }) => {
  const pathname = usePathname();
  const genre = pathname.split("/")[2]; // Get active param from URL
  const isActive = genre === param;     // Check if current item is active

  return (
    <Link href={`/top/${param}`}>
      <div className="relative px-6 py-3 rounded-full hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 cursor-pointer group">
        <h2
          className={`text-sm font-semibold transition-colors duration-300 tracking-wide uppercase ${
            isActive ? "text-white" : "text-gray-400 group-hover:text-white"
          }`}
        >
          {title}
        </h2>

        {/* Hover background effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

        {/* Active/Hover underline effect */}
        <div
          className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ${
            isActive
              ? "w-8 opacity-100"
              : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
          }`}
        ></div>
      </div>
    </Link>
  );
};

export default NavbarItem;
