"use client";

import { RecordItem } from "../lib/types";

interface StatsCardsProps {
  data: RecordItem[];
}

export default function StatsCards({ data }: StatsCardsProps) {
  const totalRecords = data.length;
  const maleCount = data.filter((r) => r.gender === "Male").length;
  const femaleCount = data.filter((r) => r.gender === "Female").length;

  const avgAge =
    data.length > 0
      ? Math.round(data.reduce((sum, r) => sum + r.age, 0) / data.length)
      : 0;

  const uniqueLocations = new Set(data.map((r) => r.locationName)).size;
  const uniqueDevices = new Set(data.map((r) => r.brandDevice)).size;

  const stats = [
    {
      title: "Total Customers",
      value: totalRecords.toLocaleString(),
      change: "+12.3%",
      changeType: "positive" as const,
      icon: "👥",
    },
    {
      title: "Average Age",
      value: `${avgAge} years`,
      change: "+2.1%",
      changeType: "positive" as const,
      icon: "📊",
    },
    {
      title: "Locations",
      value: uniqueLocations.toString(),
      change: "+5.2%",
      changeType: "positive" as const,
      icon: "📍",
    },
    {
      title: "Device Types",
      value: uniqueDevices.toString(),
      change: "-1.2%",
      changeType: "negative" as const,
      icon: "📱",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:scale-105 transition-transform">
                {stat.value}
              </p>
              <div className="flex items-center mt-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-700 bg-green-100"
                      : "text-red-700 bg-red-100"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-gray-500 text-xs ml-2">
                  vs last month
                </span>
              </div>
            </div>
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-xl`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
