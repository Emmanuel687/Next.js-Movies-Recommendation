"use client";
// Imports Start
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { Menu, X, LogIn, LogOut, Film, ChevronDown, User } from "lucide-react";
// Imports End
const Header = () => {

  // State variables Start
  const [session, setSession] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  // State variables End

  // Normal Variables Start
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/tv-shows", label: "TV Shows" },
    { href: "/watchlist", label: "Watchlist" },
    { href: "/about", label: "About" }
  ];
  // Normal Variables End

  // Handle scroll effect for header Start
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Handle scroll effect for header End


  // Close mobile menu when clicking outside Start
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest(".mobile-menu-container")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);
  // Close mobile menu when clicking outside End


  return (
    // Header Container Start
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-500 ease-out ${scrolled
        ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:border-gray-800/50"
        : "bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-b border-gray-200/30 dark:border-gray-800/30"
        }`}
    >
      {/* DeskTop Panel Start */}
      <section className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Start */}
        <Link
          href="/"
          className="flex items-center gap-3 py-4 group relative overflow-hidden"
        >
          {/* Film Logo Start */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300 group-hover:scale-110">
              <Film className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Film Logo End */}

          {/* Film Name Start */}
          <div className="flex flex-col group cursor-pointer">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Cine{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:animate-pulse">
                Scope
              </span>
            </h1>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ">
              Discover Cinema
            </span>
          </div>
          {/* Film Name End */}


        </Link>
        {/* Logo End */}

        {/* Desktop Navigation Start */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-gray-700 dark:text-gray-300 font-medium text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
            >
              <span className="relative z-10">{item.label}</span>
              <div className="absolute inset-0 scale-0 group-hover:scale-100 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-lg transition-transform duration-300 ease-out"></div>
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-8 group-hover:-translate-x-4 transition-all duration-300"></div>
            </Link>
          ))}
        </nav>
        {/* Desktop Navigation End */}

        {/* Desktop Auth Start */}
        <div className="hidden lg:flex items-center gap-3">
          {session ?
            // Logged In User Menu Start
            (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  {/* User Avatar Start */}
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  {/* User Avatar End */}

                  {/* User Name and Chevron Start */}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  {/* User Name and Chevron End */}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* Profile Link Start */}
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Profile
                    </Link>
                    {/* Profile Link End */}

                    {/* Settings Link Start */}
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Settings
                    </Link>
                    {/* Settings Link End */}

                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
          
                    {/* Sign Out Button Start */}
                    <button
                      onClick={() => setSession(false)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                    {/* Sign Out Button End */}
                  </div>
                )}

              </div>
            )
            // Logged In User Menu End
            :
            // Logged Out Buttons Start
            (
              <div className="flex items-center gap-2">
                {/* Sign Up Button Start */}
                <Link href="/signup">
                  <Button
                    label="Sign up"
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300"
                    text
                  />
                </Link>
                {/* Sign Up Button End */}

                {/* Sign In Button Start */}
                <Link href="/signin">
                  <Button
                    label="Sign in"
                    icon={<LogIn className="w-4 h-4" />}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 text-sm"
                  />
                </Link>
                {/* Sign In Button End */}
              </div>
            )
            // Logged Out Buttons End
          }
        </div>
        {/* Desktop Auth End */}

        {/* Mobile Menu Button Start */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 mobile-menu-container"
          aria-label="Toggle Menu"
        >
          <div className="relative w-6 h-6">
            <Menu className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${menuOpen ? 'opacity-0 rotate-45' : 'opacity-100 rotate-0'}`} />
            <X className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${menuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-45'}`} />
          </div>
        </button>
        {/* Mobile Menu Button End */}
      </section>
      {/* Desktop Panel End */}

      {/* Mobile Menu Panel Start */}
      <section className={`lg:hidden mobile-menu-container transition-all duration-500 ease-out ${menuOpen
        ? 'max-h-96 opacity-100'
        : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
        <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-2xl">
          <nav className="flex flex-col px-4 py-6 space-y-1">
            {/* Nav Item Start */}
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-300 transform hover:translate-x-2"
                onClick={() => setMenuOpen(false)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: menuOpen ? 'slideInLeft 0.5s ease-out forwards' : 'none'
                }}
              >
                {item.label}
              </Link>
            ))}
            {/* Nav Item End */}


            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
              {session ? 
              // Mobile Logged In User Menu Start
              (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* User Avatar Start */}
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {/* User Avatar End */}

                    {/* User Name Start */}
                    <span className="font-medium text-gray-900 dark:text-white">John Doe</span>
                    {/* User Name End */}
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Profile
                  </Link>

                  {/* Sign Out Button Start */}
                  <button
                    onClick={() => {
                      setSession(false);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                  {/* Sign Out Button End */}
                </div>
              ) 
              // Mobile Logged In User Menu End
              : 
              // Mobile Logged Out Buttons Start
              (
                <div className="space-y-2">
                  {/* Sign Up Button Start */}
                  <Link href="/signup" onClick={() => setMenuOpen(false)}>
                    <Button
                      label="Sign up"
                      className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 justify-center"
                      text
                    />
                  </Link>
                  {/* Sign Up Button End */}

                  {/* Sign In Button Start */}
                  <Link href="/signin" onClick={() => setMenuOpen(false)}>
                    <Button
                      label="Sign in"
                      icon={<LogIn className="w-4 h-4" />}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 justify-center"
                    />
                  </Link>
                  {/* Sign In Button End */}
                </div>
              )
              // Mobile Logged Out Buttons End
              }
            </div>
          </nav>
        </div>
      </section>
      {/* Mobile Menu Panel End */}

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
    // Header Container End
  );
};

export default Header;