"use client";

import React from "react";
import Link from "next/link";

const error = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-6xl font-bold text-red-600 dark:text-red-500 mb-4">Oops!</h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
        Something went wrong. We couldn&apos;t load the page.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default error;
