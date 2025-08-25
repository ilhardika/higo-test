"use client";

import type { RecordItem } from "../lib/types";

interface LocationChartProps {
  data: RecordItem[];
}

export default function LocationChart({ data }: LocationChartProps) {
  const locationStats = data.reduce((acc, record) => {
    acc[record.locationName] = (acc[record.locationName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationData = Object.entries(locationStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6); // Top 6 locations

  const maxCount = Math.max(...locationData.map(([, count]) => count));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Locations</h3>
        <div className="text-sm text-gray-500">By customer count</div>
      </div>

      <div className="space-y-4">
        {locationData.map(([location, count], index) => {
          const percentage = (count / maxCount) * 100;
          const colors = [
            "from-blue-500 to-blue-600",
            "from-purple-500 to-purple-600",
            "from-green-500 to-green-600",
            "from-orange-500 to-orange-600",
            "from-red-500 to-red-600",
            "from-pink-500 to-pink-600",
          ];

          return (
            <div key={location} className="flex items-center gap-4">
              <div className="w-4 text-sm font-medium text-gray-600">
                #{index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {location}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {count}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      colors[index % colors.length]
                    } transition-all duration-700`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
