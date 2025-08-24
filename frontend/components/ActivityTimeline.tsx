"use client";

import type { RecordItem } from "../lib/types";

interface ActivityTimelineProps {
  data: RecordItem[];
}

export default function ActivityTimeline({ data }: ActivityTimelineProps) {
  // Group by hour of day
  const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
    const count = data.filter((record) => {
      const loginHour = parseInt(record.loginHour.split(":")[0]);
      return loginHour === hour;
    }).length;

    return {
      hour,
      count,
      label:
        hour === 0
          ? "12 AM"
          : hour < 12
          ? `${hour} AM`
          : hour === 12
          ? "12 PM"
          : `${hour - 12} PM`,
    };
  });

  const maxCount = Math.max(...hourlyActivity.map((h) => h.count));

  // Find peak hours
  const peakHour = hourlyActivity.reduce((max, current) =>
    current.count > max.count ? current : max
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Activity Timeline
          </h3>
          <p className="text-sm text-gray-500">
            Customer login activity by hour
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Peak Hour</div>
          <div className="font-semibold text-blue-600">{peakHour.label}</div>
        </div>
      </div>

      <div className="relative">
        {/* Line Chart with Area Fill */}
        <div className="relative h-40 mb-6">
          <svg className="w-full h-full" viewBox="0 0 800 160">
            {/* Grid lines */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Background grid */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={32 * i}
                x2="800"
                y2={32 * i}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
            ))}

            {/* Generate path for line chart */}
            {(() => {
              const points = hourlyActivity.map((item, index) => {
                const x = (index / 23) * 800;
                const y =
                  160 - (maxCount > 0 ? (item.count / maxCount) * 140 : 0);
                return { x, y, count: item.count, hour: item.hour };
              });

              // Create smooth curve path
              const pathData = points.reduce((path, point, index) => {
                if (index === 0) return `M ${point.x} ${point.y}`;

                const prevPoint = points[index - 1];
                const cpx1 = prevPoint.x + (point.x - prevPoint.x) * 0.3;
                const cpx2 = point.x - (point.x - prevPoint.x) * 0.3;

                return (
                  path +
                  ` C ${cpx1} ${prevPoint.y}, ${cpx2} ${point.y}, ${point.x} ${point.y}`
                );
              }, "");

              // Area fill path
              const areaPath = pathData + ` L 800 160 L 0 160 Z`;

              return (
                <>
                  {/* Area fill */}
                  <path
                    d={areaPath}
                    fill="url(#areaGradient)"
                    className="transition-all duration-1000"
                  />

                  {/* Main line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-1000"
                  />

                  {/* Data points */}
                  {points.map((point, index) => {
                    const item = hourlyActivity[index];
                    const isPeak =
                      item.count === peakHour.count && item.count > 0;

                    return (
                      <g key={index}>
                        {/* Point circle */}
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={isPeak ? "6" : "4"}
                          fill={isPeak ? "#EF4444" : "#3B82F6"}
                          stroke="white"
                          strokeWidth="2"
                          className="transition-all duration-300 hover:r-6 cursor-pointer"
                        />

                        {/* Peak hour label */}
                        {isPeak && (
                          <text
                            x={point.x}
                            y={point.y - 15}
                            textAnchor="middle"
                            className="text-xs fill-red-600 font-semibold"
                          >
                            Peak
                          </text>
                        )}
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>

          {/* Interactive tooltips overlay */}
          <div className="absolute inset-0 flex items-end">
            {hourlyActivity.map((item, index) => (
              <div
                key={item.hour}
                className="flex-1 h-full group cursor-pointer"
                style={{ minWidth: "33px" }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-20 transition-opacity">
                  <div className="font-semibold">{item.label}</div>
                  <div>{item.count} logins</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time labels with better spacing */}
        <div className="flex justify-between text-sm text-gray-600 font-medium mb-4">
          <span>12 AM</span>
          <span>3 AM</span>
          <span>6 AM</span>
          <span>9 AM</span>
          <span>12 PM</span>
          <span>3 PM</span>
          <span>6 PM</span>
          <span>9 PM</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {data.length}
          </div>
          <div className="text-xs text-gray-500">Total Logins</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {peakHour.count}
          </div>
          <div className="text-xs text-gray-500">Peak Hour</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {Math.round((data.length / 24) * 10) / 10}
          </div>
          <div className="text-xs text-gray-500">Avg/Hour</div>
        </div>
      </div>
    </div>
  );
}
