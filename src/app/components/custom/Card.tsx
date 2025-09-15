// Imports Start
import React, { ReactNode } from "react";
// Imports End

// Props Type Start
type CardProps = {
  children: ReactNode;
};
// Props Type End

const Card = ({ children }: CardProps) => {
  return (
    <section
      className="rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300 border"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        borderColor: "var(--border)", // ✅ adapts to light/dark
      }}
    >
      {children}
    </section>
  );
};

export default Card;
