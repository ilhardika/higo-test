"use client";

export default function Pagination({
  page,
  setPage,
  totalPages,
}: {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="px-3 py-1 border rounded"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        Prev
      </button>
      <div className="px-3 py-1 border rounded">
        Page {page} / {totalPages}
      </div>
      <button
        className="px-3 py-1 border rounded"
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
