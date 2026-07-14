"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUsers, type UserListItem, type UsersListResponse } from "@/lib/api";
import { Icon } from "@/components/ui/Icon";

const statusStyles: Record<string, string> = {
  active: "bg-[#E8F5E9] text-[#2E7D32]",
  suspended: "bg-[#FFEBEE] text-[#C62828]",
  inactive: "bg-[#FFF3E0] text-[#EF6C00]",
};

const kycStyles: Record<string, string> = {
  verified: "bg-[#E8F5E9] text-[#2E7D32]",
  pending: "bg-[#FFF3E0] text-[#EF6C00]",
  unverified: "bg-[#FFEBEE] text-[#C62828]",
  flagged: "bg-[#FFEBEE] text-[#C62828]",
};

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

export default function UsersListPage() {
  const [data, setData] = useState<UsersListResponse["data"] | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    fetchUsers(params)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [page, search, statusFilter, dateFrom, dateTo]);

  const rows = data?.data ?? [];
  const summary = data?.summary;
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.currentPage ?? 1;
  const totalCount = data?.count ?? 0;

  return (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-headline-lg text-primary">User Management</h2>
          <p className="text-body-md text-on-surface-variant">
            View and manage all platform users, their accounts, and activity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
          <p className="font-label-md text-outline uppercase tracking-wider mb-1">Total Users</p>
          <p className="text-display-lg text-primary">{summary?.total_users?.toLocaleString() ?? "—"}</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant border-l-4 border-l-[#1565C0]">
          <p className="font-label-md text-outline uppercase tracking-wider mb-1">Online</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#1565C0] rounded-full animate-pulse" />
            <p className="text-display-lg text-[#1565C0]">{summary?.online_users?.toLocaleString() ?? "—"}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
          <p className="font-label-md text-outline uppercase tracking-wider mb-1">Active</p>
          <p className="text-display-lg text-primary">{summary?.active_users?.toLocaleString() ?? "—"}</p>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant border-l-4 border-l-error">
          <p className="font-label-md text-outline uppercase tracking-wider mb-1">Suspended</p>
          <p className="text-display-lg text-error">{summary?.suspended_users?.toLocaleString() ?? "—"}</p>
        </div>
        <div className="bg-primary text-on-primary p-4 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="font-label-md text-primary-fixed opacity-70 uppercase tracking-wider mb-1">New Today</p>
            <p className="text-headline-md font-bold text-secondary-fixed">{summary?.new_today ?? "—"}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant">
        <div className="px-4 py-3 border-b border-outline-variant bg-surface-container-low flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm" />
            <input
              className="w-full pl-9 pr-4 py-1.5 text-body-sm border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary"
              placeholder="Search by name, email or phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-1.5 text-body-sm border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            type="date"
            className="px-3 py-1.5 text-body-sm border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="From"
          />
          <input
            type="date"
            className="px-3 py-1.5 text-body-sm border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="To"
          />
          <button
            className="px-3 py-1.5 text-body-sm font-label-md text-outline border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
            onClick={() => { setSearchInput(""); setSearch(""); setStatusFilter(""); setDateFrom(""); setDateTo(""); }}
          >
            Reset
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-body-sm text-on-surface-variant">Loading users...</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-center text-body-sm text-on-surface-variant">No users found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary text-on-primary">
                <tr>
                  <th className="px-4 py-3 font-label-md uppercase tracking-widest text-[10px]">User</th>
                  <th className="px-4 py-3 font-label-md uppercase tracking-widest text-[10px]">Phone</th>
                  <th className="px-4 py-3 font-label-md uppercase tracking-widest text-[10px]">Status</th>
                  <th className="px-4 py-3 font-label-md uppercase tracking-widest text-[10px]">Tier</th>
                  <th className="px-4 py-3 font-label-md uppercase tracking-widest text-[10px]">KYC</th>
                  <th className="px-4 py-3 font-label-md uppercase tracking-widest text-[10px]">Balance</th>
                  <th className="px-4 py-3 font-label-md uppercase tracking-widest text-[10px]">Created</th>
                  <th className="px-4 py-3 font-label-md uppercase tracking-widest text-[10px] text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {rows.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-container transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-body-sm font-semibold text-primary">{user.name}</p>
                          <p className="text-[11px] text-outline">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant font-mono">{user.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${statusStyles[user.status] || ""}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">{user.tier}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${kycStyles[user.kyc_status] || ""}`}>
                        {user.kyc_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-body-sm font-mono font-semibold text-primary">{formatCurrency(user.balance)}</td>
                    <td className="px-4 py-3 text-body-sm text-on-surface-variant">
                      {new Date(user.created_at).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        className="inline-flex items-center gap-1 p-2 rounded-full text-primary hover:bg-primary-fixed transition-colors"
                        href={`/users/${user.id}`}
                      >
                        <Icon name="visibility" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-4 py-3 bg-surface-container-lowest flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-outline-variant">
          <p className="font-label-md text-outline">
            Page {currentPage} of {totalPages} ({totalCount} total entries)
          </p>
          <div className="flex gap-1">
            <button
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={!data?.previousPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <Icon name="chevron_left" className="text-sm" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, currentPage - 2);
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  className={`w-8 h-8 flex items-center justify-center rounded font-label-md transition-colors ${
                    p === currentPage
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant hover:bg-surface-container"
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}
            <button
              className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={!data?.nextPage}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <Icon name="chevron_right" className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
