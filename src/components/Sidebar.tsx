"use client";
import { useState } from "react";
const navItems = [
  { name: "Dashboard", icon: "🏠" },
  { name: "Calendar", icon: "📆" },
  { name: "Assets Library", icon: "🗂️" },
  { name: "Idea Backlog", icon: "🎒" },
  { name: "Analytics", icon: "📊" },
];
export default function Sidebar({ onNav }: { onNav: (name: string) => void }) {
  const [active, setActive] = useState("Calendar");
  return (
    <aside className="backdrop-blur-lg bg-white/10 border-r border-white/10 shadow-lg w-56 min-h-screen flex flex-col py-6 px-3 gap-2">
      <div className="mb-8 text-2xl font-bold text-accentPurple tracking-tight px-2">Content Dash</div>
      {navItems.map((item) => (
        <button
          key={item.name}
          className={`flex items-center gap-3 px-4 py-2 rounded transition-colors ${
            active === item.name
              ? "bg-gradient-to-r from-accentPurple/80 to-accentCyan/80 text-background font-semibold shadow"
              : "hover:bg-white/10 text-text"
          }`}
          onClick={() => {
            setActive(item.name);
            onNav(item.name);
          }}
        >
          <span className="text-lg">{item.icon}</span>
          {item.name}
        </button>
      ))}
    </aside>
  );
}