"use client";

import type { DashboardStats } from "../lib/types";

interface LocationChartProps {
  dashboardStats: DashboardStats | null;
}

export default function LocationChart({ dashboardStats }: LocationChartProps) {
  if (!dashboardStats) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const locationData = dashboardStats.topLocationsByName.slice(0, 6); // Top 6 locations
  const maxCount = Math.max(...locationData.map((item) => item.count));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Locations</h3>
        <div className="text-sm text-gray-500">By customer count</div>
      </div>

      <div className="space-y-4">
        {locationData.map((location, index) => {
          const percentage = (location.count / maxCount) * 100;
          const colors = [
            "from-blue-500 to-blue-600",
            "from-purple-500 to-purple-600",
            "from-green-500 to-green-600",
            "from-orange-500 to-orange-600",
            "from-red-500 to-red-600",
            "from-pink-500 to-pink-600",
          ];

          return (
            <div key={location._id} className="flex items-center gap-4">
              <div className="w-4 text-sm font-medium text-gray-600">
                #{index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {location._id}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {location.count.toLocaleString()}
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
