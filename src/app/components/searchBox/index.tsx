"use client";

import React, { useState } from "react";
import SearchBox from "../custom/Search"; 
import { useRouter } from "next/navigation";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="flex gap-2 ">
        <SearchBox
          placeholder="Search movies..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchPage;
