"use client";
import { useState } from "react";

type Asset = {
  id: string;
  url: string;
  type: "image" | "video" | "pdf";
  tags: string[];
};

const initialAssets: Asset[] = [
  { id: "1", url: "/sample1.png", type: "image", tags: ["meme"] },
  { id: "2", url: "/sample2.pdf", type: "pdf", tags: ["report"] },
];

export default function AssetLibrary() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [filter, setFilter] = useState<string>("");

  const filteredAssets = filter
    ? assets.filter((a) => a.tags.includes(filter))
    : assets;

  return (
    <div className="p-6">
      <div className="mb-4 flex gap-2">
        <input
          className="bg-background px-3 py-2 rounded"
          placeholder="Filter by tag"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <div key={asset.id} className="bg-card rounded p-3 border border-neutral-800">
            {asset.type === "image" && (
              <img src={asset.url} alt="asset" className="rounded mb-2 w-full h-24 object-cover" />
            )}
            {asset.type === "pdf" && (
              <div className="mb-2 text-accentPurple">PDF: {asset.url}</div>
            )}
            {asset.type === "video" && (
              <video src={asset.url} controls className="rounded mb-2 w-full h-24 object-cover" />
            )}
            <div className="text-xs text-accentCyan">{asset.tags.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}