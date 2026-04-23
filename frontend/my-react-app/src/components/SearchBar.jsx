import React from "react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
}) {
  return (
    <div className="search-input-box">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
