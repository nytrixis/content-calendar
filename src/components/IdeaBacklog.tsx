"use client";
import { useState } from "react";
import { PostType, Platform } from "./types";

type Idea = {
  id: string;
  title: string;
  type: PostType;
  platform: Platform[];
  impact: number;
};

const initialIdeas: Idea[] = [
  { id: "1", title: "Share a dev meme", type: "General Thought", platform: ["Twitter"], impact: 7 },
  { id: "2", title: "Critique new LinkedIn UI", type: "App Critique", platform: ["LinkedIn"], impact: 8 },
];

export default function IdeaBacklog({ onConvert }: { onConvert: (idea: Idea) => void }) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [sort, setSort] = useState<"impact" | "type" | "platform">("impact");

  const sortedIdeas = [...ideas].sort((a, b) => {
    if (sort === "impact") return b.impact - a.impact;
    if (sort === "type") return a.type.localeCompare(b.type);
    if (sort === "platform") return a.platform.join().localeCompare(b.platform.join());
    return 0;
  });

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-4">
        <button className={sort === "impact" ? "underline" : ""} onClick={() => setSort("impact")}>Impact</button>
        <button className={sort === "type" ? "underline" : ""} onClick={() => setSort("type")}>Type</button>
        <button className={sort === "platform" ? "underline" : ""} onClick={() => setSort("platform")}>Platform</button>
      </div>
      <ul className="space-y-2">
        {sortedIdeas.map((idea) => (
          <li key={idea.id} className="bg-card rounded p-4 flex justify-between items-center border border-neutral-800">
            <div>
              <div className="font-semibold">{idea.title}</div>
              <div className="text-xs text-accentCyan">{idea.type}</div>
              <div className="text-xs text-accentPurple">{idea.platform.join(", ")}</div>
              <div className="text-xs text-status">Impact: {idea.impact}</div>
            </div>
            <button
              className="bg-accentCyan text-background px-3 py-1 rounded hover:bg-accentPurple transition"
              onClick={() => onConvert(idea)}
            >
              Convert to Post
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}