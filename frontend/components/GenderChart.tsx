"use client";

export default function GenderChart({
  data,
}: {
  data: { gender: string; count: number }[];
}) {
  const total = data.reduce((s, b) => s + b.count, 0) || 1;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Gender Distribution
        </h3>
        <div className="text-sm text-gray-500">
          Total: {total.toLocaleString()}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No data available</div>
      ) : (
        <div className="space-y-4">
          {data.map((item) => {
            const percentage = Math.round((item.count / total) * 100);

            return (
              <div key={item.gender} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        item.gender === "Male"
                          ? "bg-blue-500"
                          : item.gender === "Female"
                          ? "bg-pink-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="font-medium text-gray-700">
                      {item.gender}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {item.count.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">{percentage}%</div>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      item.gender === "Male"
                        ? "bg-gradient-to-r from-blue-400 to-blue-600"
                        : item.gender === "Female"
                        ? "bg-gradient-to-r from-pink-400 to-pink-600"
                        : "bg-gradient-to-r from-gray-400 to-gray-600"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Pie Chart Visualization */}
          <div className="mt-8 flex justify-center">
            <div className="relative w-32 h-32">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="3"
                />
                {data.map((item, index) => {
                  let cumulativePercentage = 0;
                  for (let i = 0; i < index; i++) {
                    cumulativePercentage += (data[i].count / total) * 100;
                  }
                  const currentPercentage = (item.count / total) * 100;

                  return (
                    <circle
                      key={item.gender}
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke={
                        item.gender === "Male"
                          ? "#3b82f6"
                          : item.gender === "Female"
                          ? "#ec4899"
                          : "#6b7280"
                      }
                      strokeWidth="3"
                      strokeDasharray={`${currentPercentage} ${
                        100 - currentPercentage
                      }`}
                      strokeDashoffset={-cumulativePercentage}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
