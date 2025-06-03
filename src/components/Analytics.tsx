"use client";
const stats = [
  { label: "Total Posts", value: 42 },
  { label: "Avg Engagement", value: "120" },
  { label: "Best Platform", value: "LinkedIn" },
];

export default function Analytics() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded p-4 border border-neutral-800">
            <div className="text-status text-lg font-bold">{stat.value}</div>
            <div className="text-text text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded p-4 border border-neutral-800">
        <div className="text-text mb-2">Engagement Over Time (stub)</div>
        <div className="h-24 bg-neutral-900 rounded"></div>
      </div>
    </div>
  );
}