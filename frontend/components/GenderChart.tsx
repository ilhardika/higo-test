"use client";

export default function GenderChart({
  data,
}: {
  data: { gender: string; count: number }[];
}) {
  const total = data.reduce((s, b) => s + b.count, 0) || 1;
  return (
    <div>
      {data.length === 0 ? (
        <div className="text-sm text-gray-500">No data</div>
      ) : (
        <ul className="space-y-2">
          {data.map((b) => {
            const pct = Math.round((b.count / total) * 100);
            return (
              <li key={b.gender} className="flex items-center gap-3">
                <div className="w-24 text-xs text-gray-700 dark:text-gray-300">
                  {b.gender}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-[#111] rounded overflow-hidden h-4">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-4 bg-blue-500"
                  />
                </div>
                <div className="w-12 text-right text-xs text-gray-600 dark:text-gray-400">
                  {b.count}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
