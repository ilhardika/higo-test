"use client";

import { useEffect, useState } from "react";
import { fetchRecords, fetchGenderStats } from "../lib/mock";
import DataTable from "./DataTable";
import GenderChart from "./GenderChart";
import Pagination from "./Pagination";
import StatsCards from "./StatsCards";
import LocationChart from "./LocationChart";
import ActivityTimeline from "./ActivityTimeline";
import type { RecordItem } from "../lib/types";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [q, setQ] = useState("");
  const [data, setData] = useState<RecordItem[]>([]);
  const [allData, setAllData] = useState<RecordItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ gender: string; count: number }[]>([]);

  // Load all data for stats (simulating what would be separate API calls)
  useEffect(() => {
    let mounted = true;
    fetchGenderStats().then((s) => mounted && setStats(s.buckets));
    fetchRecords({ page: 1, limit: 999 }).then(
      (res) => mounted && setAllData(res.data)
    );
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchRecords({ page, limit, gender, q }).then((res) => {
      if (!mounted) return;
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [page, limit, gender, q]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatsCards data={allData} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GenderChart data={stats} />
        <LocationChart data={allData} />
        <ActivityTimeline data={allData} />
      </div>

      {/* Filters & Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search customers
              </label>
              <input
                placeholder="Name, email, location..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by gender
              </label>
              <select
                value={gender ?? ""}
                onChange={(e) => {
                  setGender(e.target.value || undefined);
                  setPage(1);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">All genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Records per page
              </label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {/* Quick filters */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setGender(undefined);
                setQ("");
                setPage(1);
              }}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Clear filters
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Refresh data
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={data} loading={loading} />

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">{(page - 1) * limit + 1}</span> to{" "}
          <span className="font-semibold">{Math.min(page * limit, total)}</span>{" "}
          of <span className="font-semibold">{total.toLocaleString()}</span>{" "}
          customers
        </div>
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
