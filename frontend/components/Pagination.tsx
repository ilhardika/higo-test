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
  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  const getVisiblePages = () => {
    // Mobile: show fewer pages
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const delta = isMobile ? 1 : 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Mobile: Simple page info */}
      <div className="text-sm text-gray-600 order-2 sm:order-1">
        Page {page} of {totalPages}
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1 order-1 sm:order-2">
        {/* Mobile: Compact navigation */}
        <div className="flex items-center gap-1 sm:hidden">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={!canGoPrevious}
            className={`p-2 text-sm font-medium rounded-lg transition-colors ${
              canGoPrevious
                ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            }`}
            aria-label="Previous page"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-1 mx-2">
            {getVisiblePages().map((pageNum, idx) => {
              if (pageNum === "...") {
                return (
                  <span
                    key={`mobile-dots-${idx}`}
                    className="px-2 py-2 text-sm text-gray-400"
                  >
                    ...
                  </span>
                );
              }

              const isCurrentPage = pageNum === page;
              return (
                <button
                  key={`mobile-${pageNum}`}
                  onClick={() => setPage(pageNum as number)}
                  className={`px-2 py-2 min-w-[36px] text-sm font-medium rounded-lg transition-colors ${
                    isCurrentPage
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={!canGoNext}
            className={`p-2 text-sm font-medium rounded-lg transition-colors ${
              canGoNext
                ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            }`}
            aria-label="Next page"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Desktop: Full navigation */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={!canGoPrevious}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              canGoPrevious
                ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            First
          </button>

          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={!canGoPrevious}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              canGoPrevious
                ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            Previous
          </button>

          <div className="flex items-center gap-1 mx-2">
            {getVisiblePages().map((pageNum, idx) => {
              if (pageNum === "...") {
                return (
                  <span
                    key={`desktop-dots-${idx}`}
                    className="px-3 py-2 text-sm text-gray-400"
                  >
                    ...
                  </span>
                );
              }

              const isCurrentPage = pageNum === page;
              return (
                <button
                  key={`desktop-${pageNum}`}
                  onClick={() => setPage(pageNum as number)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isCurrentPage
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={!canGoNext}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              canGoNext
                ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            Next
          </button>

          <button
            onClick={() => setPage(totalPages)}
            disabled={!canGoNext}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              canGoNext
                ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            Last
          </button>
        </div>
      </nav>
    </div>
  );
}
