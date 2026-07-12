import { Icon } from "@/components/ui/Icon";

export default function BillPaymentDetailPage() {
  return (
    <>
      <header className="flex items-center gap-4 mb-4">
        <button className="text-primary hover:bg-surface-container-low p-2 rounded-full transition-colors">
          <Icon name="arrow_back" />
        </button>
        <h2 className="text-headline-md font-bold text-primary">Bill Details</h2>
      </header>

      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-label-md text-on-surface-variant mb-4">
          <span className="hover:text-primary cursor-pointer">Transactions</span>
          <Icon name="chevron_right" className="text-[14px]" />
          <span className="hover:text-primary cursor-pointer">Bill Payments</span>
          <Icon name="chevron_right" className="text-[14px]" />
          <span className="text-primary font-bold">IKEDC-99382201</span>
        </nav>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 space-y-4">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-surface-container rounded-lg border border-outline-variant flex items-center justify-center overflow-hidden">
                    <div className="w-16 h-16 bg-surface-container-highest rounded flex items-center justify-center text-primary font-bold">
                      IK
                    </div>
                  </div>
                  <div>
                    <h3 className="text-headline-lg text-primary">Ikeja Electric (IKEDC)</h3>
                    <p className="text-body-md text-on-surface-variant">Post-paid Electricity Bill Payment</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-[2px] bg-secondary-fixed text-on-secondary-fixed rounded-full text-label-md">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                      SUCCESSFUL
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-label-md text-on-surface-variant uppercase tracking-widest">Amount Paid</p>
                  <h4 className="text-display-lg text-primary leading-tight">₦45,500.00</h4>
                  <p className="text-body-sm text-on-surface-variant">Fee: ₦100.00 | Total: ₦45,600.00</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-4 border-t border-outline-variant">
                <div>
                  <p className="text-label-md text-outline uppercase">Recipient Account</p>
                  <p className="text-body-lg text-on-surface font-semibold">5422 1093 884</p>
                  <p className="text-body-sm text-on-surface-variant">Account Name: ADEREMI JOHNSON</p>
                </div>
                <div>
                  <p className="text-label-md text-outline uppercase">Payment Reference</p>
                  <p className="text-body-lg text-on-surface font-semibold flex items-center gap-1">
                    FT-IKEDC-20231109-772
                    <Icon name="content_copy" className="text-[18px] text-outline hover:text-primary cursor-pointer" />
                  </p>
                </div>
                <div>
                  <p className="text-label-md text-outline uppercase">Transaction Date</p>
                  <p className="text-body-lg text-on-surface font-semibold">November 09, 2023 — 14:32 WAT</p>
                </div>
                <div>
                  <p className="text-label-md text-outline uppercase">Service Address</p>
                  <p className="text-body-lg text-on-surface font-semibold">12, Oba Akran Ave, Ikeja, Lagos State</p>
                </div>
                <div className="col-span-2">
                  <p className="text-label-md text-outline uppercase">Token Generated</p>
                  <div className="mt-1 p-3 bg-surface-container rounded-lg border border-secondary/20 flex justify-between items-center group cursor-pointer hover:border-secondary transition-colors">
                    <span className="font-mono text-headline-md tracking-[0.2em] text-primary">4410 8823 1190 2341 0092</span>
                    <button className="bg-secondary text-on-secondary px-3 py-1 rounded-lg text-label-md group-hover:scale-105 transition-transform">
                      COPY
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-outline-variant rounded-xl p-4">
              <h5 className="text-label-md text-outline uppercase mb-3">Payment Lifecycle</h5>
              <div className="flex items-center gap-3">
                {[
                  { icon: "check", label: "Initiated", time: "Nov 09, 14:30:12" },
                  { icon: "account_balance", label: "Bank Authorized", time: "Nov 09, 14:31:05" },
                  { icon: "check_circle", label: "Biller Settled", time: "Nov 09, 14:32:44" },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-on-secondary">
                        <Icon name={step.icon} className="text-[18px]" />
                      </div>
                      <div className={`w-0.5 h-8 ${i < 2 ? "bg-secondary/30" : "bg-transparent"}`} />
                    </div>
                    <div className="pb-8">
                      <p className="text-body-md font-semibold text-primary">{step.label}</p>
                      <p className="text-body-sm text-on-surface-variant">{step.time}</p>
                    </div>
                    {i < 2 && <div className="w-8 h-px bg-outline-variant mx-1 mb-8" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-4">
            <div className="bg-primary text-on-primary rounded-xl p-4 shadow-xl shadow-primary/10">
              <h5 className="text-headline-md text-secondary-fixed mb-3">Manage Bill</h5>
              <div className="space-y-2">
                {[
                  { icon: "download", label: "Download Receipt" },
                  { icon: "mail", label: "Email Confirmation" },
                  { icon: "repeat", label: "Repeat Payment" },
                  { icon: "star", label: "Add to Favorites" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={action.icon} />
                      <span className="text-body-md">{action.label}</span>
                    </div>
                    <Icon name="chevron_right" className="text-[18px]" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4">
              <h5 className="text-label-md text-outline uppercase mb-3">Account Balance</h5>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-headline-md text-primary">₦2,140,550.00</p>
                  <p className="text-body-sm text-on-surface-variant">Institutional Operating Account</p>
                </div>
                <div className="text-right">
                  <span className="text-secondary font-bold text-label-md">+4.2%</span>
                </div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-outline-variant">
                <p className="text-body-sm text-on-surface-variant mb-1">Next recurring payment</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">MTN Airtime</span>
                  <span className="text-body-sm">Dec 01, 2023</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary-container text-on-secondary-container rounded-xl p-4 relative overflow-hidden group cursor-pointer">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Icon name="support_agent" className="text-[80px]" />
              </div>
              <h5 className="text-headline-md mb-1">Need help?</h5>
              <p className="text-body-md mb-3 opacity-80">
                Encountered an issue with this IKEDC payment? Our desk is available 24/7.
              </p>
              <button className="bg-on-secondary-container text-white px-4 py-2 rounded-lg font-label-md hover:shadow-lg transition-all">
                Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
