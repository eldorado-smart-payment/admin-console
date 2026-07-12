"use client";

type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  totalEntries?: number;
  pageSize?: number;
};

export function Pagination({
  currentPage = 1,
  totalPages = 58,
  totalEntries = 1429,
  pageSize = 25,
}: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalEntries);

  return (
    <div className="p-3 bg-surface-container-lowest flex justify-between items-center border-t border-outline-variant">
      <p className="text-label-md text-outline">
        Showing <span className="text-primary font-bold">{start} - {end}</span> of{" "}
        <span className="text-on-surface font-bold">{totalEntries.toLocaleString()}</span>
      </p>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-low transition-colors disabled:opacity-50">
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <button className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary text-xs font-bold rounded">
          1
        </button>
        <button className="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface text-xs font-medium rounded hover:bg-surface-container-low">
          2
        </button>
        <button className="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface text-xs font-medium rounded hover:bg-surface-container-low">
          3
        </button>
        <span className="text-outline text-xs px-1">...</span>
        <button className="w-8 h-8 flex items-center justify-center border border-outline-variant text-on-surface text-xs font-medium rounded hover:bg-surface-container-low">
          {totalPages}
        </button>
        <button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-low transition-colors">
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
