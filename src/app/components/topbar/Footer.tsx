"use client";

import React from "react";
import Link from "next/link";
import { Film, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[var(--foreground)]">
                Cine<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Scope</span>
              </h3>
              <p className="text-xs text-[var(--foreground)] opacity-70">
                Discover Cinema
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-[var(--foreground)] opacity-80">
            <Link href="/about" className="hover:opacity-100 transition-opacity">
              About
            </Link>
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">
              Privacy
            </Link>
            <Link href="/terms" className="hover:opacity-100 transition-opacity">
              Terms
            </Link>
            <Link href="/contact" className="hover:opacity-100 transition-opacity">
              Contact
            </Link>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-[var(--foreground)] opacity-70">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>© {currentYear} Cinescope</span>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="mt-6 pt-6 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--foreground)] opacity-60">
            Powered by TMDB API • Made for movie lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;