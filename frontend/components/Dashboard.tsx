"use client";

import { useEffect, useState } from "react";
import { fetchRecords, fetchGenderStats } from "../lib/mock";
import DataTable from "./DataTable";
import GenderChart from "./GenderChart";
import Pagination from "./Pagination";
import type { RecordItem } from "../lib/types";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [q, setQ] = useState("");
  const [data, setData] = useState<RecordItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ gender: string; count: number }[]>([]);

  useEffect(() => {
    // load stats once
    let mounted = true;
    fetchGenderStats().then((s) => mounted && setStats(s.buckets));
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
    <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
      <aside className="p-4 bg-white dark:bg-[#0b0b0b] rounded shadow">
        <h2 className="font-semibold mb-3">Gender stats</h2>
        <GenderChart data={stats} />
        <div className="mt-4">
          <label className="block text-sm mb-1">Filter by gender</label>
          <select
            value={gender ?? ""}
            onChange={(e) => {
              setGender(e.target.value || undefined);
              setPage(1);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">All</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </aside>

      <div>
        <div className="mb-4 flex gap-2 items-center">
          <input
            placeholder="Search name, email, location"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="flex-1 p-2 border rounded"
          />
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="p-2 border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>

        <DataTable data={data} loading={loading} />

        <div className="mt-4">
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          <div className="text-sm text-gray-600 mt-2">Total: {total}</div>
        </div>
      </div>
    </section>
  );
}
