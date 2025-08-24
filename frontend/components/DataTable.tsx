"use client";

import type { RecordItem } from "../lib/types";

export default function DataTable({
  data,
  loading,
}: {
  data: RecordItem[];
  loading: boolean;
}) {
  return (
    <div className="bg-white dark:bg-[#0b0b0b] rounded shadow overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 dark:bg-[#0a0a0a]">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Gender</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="p-4 text-center">
                Loading…
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center">
                No records
              </td>
            </tr>
          ) : (
            data.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{r.name}</td>
                <td className="p-2">{r.gender}</td>
                <td className="p-2">{r.email}</td>
                <td className="p-2">{r.location}</td>
                <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
