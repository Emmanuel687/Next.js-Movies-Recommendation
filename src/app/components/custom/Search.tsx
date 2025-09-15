import React from "react";

type SearchProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Search = ({ placeholder = "Search...", value, onChange }: SearchProps) => {
  return (
    <div
      className="w-full max-w-md rounded-lg shadow-sm border px-3 py-2 flex items-center"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        borderColor: "var(--border)", // ✅ Border adapts with theme
      }}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none"
        style={{
          color: "var(--foreground)",
        }}
      />
    </div>
  );
};

export default Search;
