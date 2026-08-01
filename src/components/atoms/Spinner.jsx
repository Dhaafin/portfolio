"use client";

import React from "react";

export default function Spinner({ size = "md", color = "primary", className = "" }) {
  const sizeClasses = {
    xs: "w-3 h-3 border-2",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-[2.5px]",
    lg: "w-8 h-8 border-3",
    xl: "w-12 h-12 border-4",
  };

  const colorClasses = {
    primary: "border-t-[#A78BFA] border-white/10",
    white: "border-t-white border-white/10",
    black: "border-t-black border-black/10",
  };

  return (
    <div
      className={`rounded-full animate-spin ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.primary} ${className}`}
      role="status"
      aria-label="loading"
    />
  );
}
