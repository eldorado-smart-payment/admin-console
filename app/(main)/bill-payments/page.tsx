const settlements = [
  { vendor: "MTN Nigeria", short: "MT", date: "Oct 12, 2023", category: "AIRTIME & DATA", ref: "VAS-902341-B", amount: "₦14,200.00", status: "Settled", color: "emerald" },
  { vendor: "MultiChoice (DSTV)", short: "DS", date: "Oct 11, 2023", category: "TV SUBS", ref: "VAS-881203-A", amount: "₦18,900.00", status: "Processing", color: "blue" },
  { vendor: "EKEDC Postpaid", short: "EK", date: "Oct 09, 2023", category: "ELECTRICITY", ref: "UTL-811442-C", amount: "₦21,110.45", status: "Failed", color: "red" },
  { vendor: "Spectranet 4G", short: "SP", date: "Oct 05, 2023", category: "INTERNET", ref: "VAS-765121-Z", amount: "₦18,440.00", status: "Settled", color: "emerald" },
];

const statusColors: Record<string, string> = {
  Settled: "bg-emerald-100 text-emerald-800",
  Processing: "bg-blue-100 text-blue-800",
  Failed: "bg-red-100 text-red-800",
};

export default function BillPaymentsPage() {
  return (
    <>
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-headline-lg text-on-surface">Bill Payment Hub</h2>
          <p className="text-on-surface-variant">Manage corporate liabilities and institutional disbursements</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-outline text-on-surface-variant rounded-lg hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-md">filter_alt</span>
            <span className="text-sm font-semibold">Filter View</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-colors">
            <span className="material-symbols-outlined text-md">checklist</span>
            <span className="text-sm font-semibold">Bulk Approval</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary text-on-primary p-4 rounded-xl border border-primary-container shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
              <span className="p-2 bg-primary-container rounded-lg text-[#fdca60]">
                <span className="material-symbols-outlined">payments</span>
              </span>
              <span className="text-[10px] font-bold text-primary-fixed-dim uppercase tracking-wider">Revenue</span>
            </div>
            <p className="text-primary-fixed-dim font-medium text-xs mb-1">Merchant Gross Revenue</p>
            <p className="text-headline-md text-white font-mono">₦8,942,105.00</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-secondary-fixed font-medium">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+18.2% vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2 bg-primary-container/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </span>
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Liquidity</span>
          </div>
          <p className="text-on-surface-variant font-medium text-xs mb-1">Partner Bank Balance</p>
          <p className="text-headline-md font-mono text-primary">₦2,450,000.00</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-on-surface-variant font-medium">
            <span>Settlement Float: Active</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="p-2 bg-secondary-container/10 rounded-lg text-secondary">
              <span className="material-symbols-outlined">percent</span>
            </span>
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Earnings</span>
          </div>
          <p className="text-on-surface-variant font-medium text-xs mb-1">Service Commissions</p>
          <p className="text-headline-md font-mono text-primary">₦124,800.00</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-secondary font-medium">
            <span className="material-symbols-outlined text-sm">stars</span>
            <span>Top Tier Partner Rate</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm">
        <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
          <h3 className="font-bold text-primary">Settlement History</h3>
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface px-3 py-1.5 rounded-lg border border-outline-variant">
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              <span>Last 30 Days</span>
            </div>
            <button className="p-1.5 hover:bg-surface-container-low rounded-lg transition-colors text-primary">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-[11px] font-bold text-primary uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Vendor / Recipient</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {settlements.map((s) => (
                <tr key={s.ref} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-[10px]">
                        {s.short}
                      </div>
                      <span className="font-bold text-sm">{s.vendor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono">{s.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-bold text-on-surface-variant">
                      {s.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-outline">{s.ref}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-primary">{s.amount}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[s.status] || ""}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-outline-variant flex justify-between items-center bg-surface-bright">
          <p className="text-xs text-on-surface-variant">Showing 1-4 of 128 records</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low text-xs font-bold text-primary disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low text-xs font-bold text-primary">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
