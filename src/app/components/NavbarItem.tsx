"use client";
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
  const isActive = genre === param;

  return (
    <Link href={`/top/${param}`}>
      <div className="relative cursor-pointer px-2 group">
        <h2
          className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
            isActive
              ? "text-purple-500 dark:text-purple-400"
              : "text-gray-600 dark:text-gray-400 group-hover:text-purple-400"
          }`}
        >
          {title}
        </h2>

        {/* Animated active indicator */}
        <div
          className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ${
            isActive
              ? "w-full opacity-100"
              : "w-0 opacity-0 group-hover:w-3/4 group-hover:opacity-100"
          }`}
        />
      </div>
    </Link>
  );
};

export default NavbarItem;
