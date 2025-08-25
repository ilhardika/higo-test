"use client";

import type { DashboardStats } from "../lib/types";

interface ActivityTimelineProps {
  dashboardStats: DashboardStats | null;
}

export default function ActivityTimeline({ dashboardStats }: ActivityTimelineProps) {
  if (!dashboardStats) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Use interest distribution as activity timeline
  const activities = dashboardStats.interestDistribution.slice(0, 6).map((interest, index) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500", 
      "bg-green-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-pink-500",
    ];

    const interestIcons: Record<string, string> = {
      "Gaming": "🎮",
      "E-commerce": "🛒", 
      "Sport": "⚽",
      "News": "📰",
      "Social Media": "📱",
      "Music": "🎵",
      "Technology": "💻",
      "Podcast": "🎙️",
    };

    return {
      id: interest._id,
      title: `${interestIcons[interest._id] || "📊"} ${interest._id}`,
      count: interest.count,
      color: colors[index % colors.length],
    };
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Digital Interests</h3>
        <div className="text-sm text-gray-500">By popularity</div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${activity.color}`}></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {activity.title}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {activity.count.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {((activity.count / dashboardStats.totalRecords) * 100).toFixed(1)}% of users
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Most Popular:</span>
          <span className="font-medium text-gray-900">
            {activities[0]?.title || "Gaming"}
          </span>
        </div>
      </div>
    </div>
  );
}
