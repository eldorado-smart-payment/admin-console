import { Icon } from "@/components/ui/Icon";

const users = [
  { initials: "EM", name: "Elena Markov", email: "e.markov@goldman.com", role: "Compliance Officer", roleIcon: "security", roleColor: "text-secondary", status: "ACTIVE", session: "Today, 09:42 AM" },
  { name: "Julian Thorne", email: "j.thorne@apexcap.io", role: "Senior Trader", roleIcon: "monitoring", roleColor: "text-primary", status: "ACTIVE", session: "Yesterday, 04:15 PM", avatar: true },
  { initials: "SW", name: "Sarah Winston", email: "sarah.w@institutional.net", role: "Admin", roleIcon: "admin_panel_settings", roleColor: "text-outline", status: "SUSPENDED", session: "12 Oct, 2023" },
];

export default function AdminConsolePage() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-headline-lg text-primary tracking-tight">Admin Console</h2>
        <p className="text-body-md text-on-surface-variant">
          Manage institutional users, operational tiers, and complex system permissions with centralized authority.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="glass-panel p-3 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-label-md text-outline font-bold uppercase">System Health</span>
            <span className="flex items-center gap-1 px-2 py-[2px] bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="mt-3">
            <p className="text-display-lg text-primary leading-none">
              99.98<span className="text-headline-md">%</span>
            </p>
            <p className="text-body-sm text-on-surface-variant mt-1">Core engine latency: 12ms</p>
          </div>
        </div>

        <div className="glass-panel p-3 rounded-xl col-span-1 md:col-span-2 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-label-md text-outline font-bold uppercase">Account Tiers Overview</span>
            <button className="text-secondary text-label-md font-bold hover:underline">View Distribution</button>
          </div>
          <div className="flex gap-4 flex-1 items-end">
            {[
              { label: "INDIVIDUAL", height: "45%", color: "bg-primary-container", count: "1,204" },
              { label: "CORPORATE", height: "70%", color: "bg-secondary", count: "458" },
              { label: "INSTITUTIONAL", height: "90%", color: "bg-primary", count: "212" },
            ].map((tier) => (
              <div key={tier.label} className="flex-1 space-y-1">
                <div className="h-24 w-full bg-surface-container-high relative rounded-sm overflow-hidden">
                  <div className={`absolute bottom-0 w-full ${tier.color}`} style={{ height: tier.height }} />
                </div>
                <p className="text-[10px] font-bold text-center">{tier.label}</p>
                <p className="text-label-md text-center">{tier.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-3 rounded-xl bg-primary text-on-primary">
          <span className="text-label-md text-primary-fixed-dim font-bold uppercase">Active User count</span>
          <div className="mt-3">
            <p className="text-display-lg leading-none">3,892</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-primary-fixed border border-primary" />
                ))}
              </div>
              <p className="text-[10px] text-primary-fixed">+12 today</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-8 glass-panel rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
            <h3 className="text-headline-md text-primary">User Directory</h3>
            <div className="flex gap-2">
              <button className="px-3 py-2 border border-outline-variant rounded-lg text-label-md font-bold hover:bg-surface-container-low transition-colors">
                EXPORT CSV
              </button>
              <button className="px-3 py-2 bg-primary text-on-primary rounded-lg text-label-md font-bold flex items-center gap-1 hover:opacity-90 transition-all">
                <Icon name="person_add" className="text-[18px]" />
                ADD USER
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest">
                  <th className="px-4 py-2">User Identity</th>
                  <th className="px-4 py-2">Role Designation</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Last Session</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {users.map((user) => (
                  <tr key={user.email} className="hover:bg-[#FFFBEB] transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <div className="w-10 h-10 rounded-full bg-surface-container-high" />
                        ) : (
                          <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center text-primary font-bold text-sm">
                            {user.initials}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-primary">{user.name}</p>
                          <p className="text-body-sm text-outline">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon name={user.roleIcon} className={`${user.roleColor} text-[20px]`} />
                        <span className="text-body-sm">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-sm border ${
                        user.status === "ACTIVE"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-error-container text-error border-red-100"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-body-sm">{user.session}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 text-outline hover:text-primary transition-colors">
                        <Icon name="more_vert" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-surface-container-low/30 border-t border-outline-variant flex justify-between items-center">
            <p className="text-body-sm text-outline">Showing 1-3 of 2,105 entries</p>
            <div className="flex gap-1">
              <button className="p-1 border border-outline-variant rounded hover:bg-surface-container-low">
                <Icon name="chevron_left" />
              </button>
              <button className="p-1 border border-outline-variant rounded hover:bg-surface-container-low">
                <Icon name="chevron_right" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-4 rounded-xl flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-headline-md text-primary">Permissions Presets</h3>
              <Icon name="info" className="text-outline" />
            </div>
            <div className="space-y-2">
              {[
                { title: "Full Admin", desc: "Unrestricted access to all core systems, financial rails, and user databases.", star: true },
                { title: "Treasury Ops", desc: "Authorization for capital movement, liquidity management, and reporting." },
                { title: "Read-Only Auditor", desc: "View-only privileges for compliance logs and transaction history." },
              ].map((preset) => (
                <div key={preset.title} className="p-3 rounded-lg border border-outline-variant hover:border-secondary cursor-pointer transition-all bg-surface-container-lowest">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-primary">{preset.title}</p>
                    {preset.star && (
                      <Icon name="stars" className="text-secondary" filled />
                    )}
                  </div>
                  <p className="text-body-sm text-on-surface-variant">{preset.desc}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 py-3 bg-secondary text-on-secondary font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all">
              <Icon name="tune" />
              Create Custom Role
            </button>
          </div>

          <div className="bg-primary-container p-4 rounded-xl text-on-primary-fixed space-y-3 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-bold text-body-lg">Security Protocol v4.2</h4>
              <p className="text-body-sm opacity-80">
                Institutional-grade multi-signature authorization is required for all role changes within this environment.
              </p>
              <button className="mt-2 text-secondary-fixed font-bold text-label-md flex items-center gap-1 hover:underline">
                LEARN MORE <Icon name="open_in_new" className="text-[14px]" />
              </button>
            </div>
            <Icon name="verified_user" className="absolute -bottom-4 -right-4 text-[120px] text-primary opacity-20 pointer-events-none" filled />
          </div>
        </div>
      </div>
    </>
  );
}
