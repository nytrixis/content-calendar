"use client";
export default function Topbar({ onNewPost }: { onNewPost: () => void }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-neutral-800">
      <input
        type="text"
        placeholder="Search or /command…"
        className="bg-card text-text px-4 py-2 rounded w-72 outline-none"
      />
      <button
        className="bg-accentCyan text-background px-4 py-2 rounded font-semibold hover:bg-accentPurple transition"
        onClick={onNewPost}
      >
        + New Post
      </button>
    </header>
  );
}