"use client";

import { useEffect, useState } from "react";
import { apiClient } from "../lib/api";
import DataTable from "./DataTable";
import GenderChart from "./GenderChart";
import Pagination from "./Pagination";
import StatsCards from "./StatsCards";
import LocationChart from "./LocationChart";
import ActivityTimeline from "./ActivityTimeline";
import type { RecordItem, GenderStats, DashboardStats } from "../lib/types";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [q, setQ] = useState("");
  const [data, setData] = useState<RecordItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<GenderStats[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );

  // Load dashboard stats
  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      try {
        const [genderStats, dashStats] = await Promise.all([
          apiClient.getGenderStats(),
          apiClient.getDashboardStats(),
        ]);
        if (mounted) {
          setStats(genderStats);
          setDashboardStats(dashStats);
        }
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  // Load paginated data
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        const result = await apiClient.getRecords({
          page,
          limit,
          gender,
          search: q || undefined,
        });

        if (mounted) {
          setData(result.data);
          setTotal(result.pagination.total);
          setTotalPages(result.pagination.totalPages);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [page, limit, gender, q]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatsCards data={data} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GenderChart
          data={stats.map((s) => ({ gender: s._id, count: s.count }))}
        />
        <LocationChart data={data} />
        <ActivityTimeline data={data} />
      </div>

      {/* Filters & Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or location..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={gender || ""}
              onChange={(e) => setGender(e.target.value || undefined)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && (
          <>
            <DataTable data={data} loading={loading} />
            <div className="mt-6">
              <Pagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
