import { Icon } from "@/components/ui/Icon";

export default function KYCSubmissionPage() {
  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-6 flex justify-between items-end">
          <div>
            <nav className="flex gap-2 text-label-md text-outline mb-2">
              <span>Compliance</span>
              <span>/</span>
              <span className="text-primary font-bold">Admin KYC Submission</span>
            </nav>
            <h1 className="text-headline-lg text-on-background">Admin KYC Submission Portal</h1>
            <p className="text-on-surface-variant mt-1">
              Manual verification and entry for institutional grade high-net-worth individuals.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-outline rounded text-label-md text-primary hover:bg-surface-container transition-colors">
              Discard Draft
            </button>
            <button className="px-3 py-2 bg-primary text-on-primary rounded text-label-md flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
              <Icon name="save" className="text-[18px]" />
              Save Progress
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl">
              <h3 className="text-label-md font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                Submission Progress
              </h3>
              <div className="space-y-4">
                {[
                  { num: "1", label: "Tier 1: Core", desc: "BVN & Biometrics", progress: "w-[60%]", active: true },
                  { num: "2", label: "Tier 2: Identity", desc: "NIN & Govt ID", progress: "w-0", active: false },
                  { num: "3", label: "Tier 3: Address", desc: "Proof of Residency", progress: "w-0", active: false },
                ].map((step) => (
                  <div key={step.num} className={`flex gap-3 ${!step.active ? "opacity-50" : ""}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step.active ? "bg-secondary text-white" : "bg-surface-container text-on-surface-variant"
                      }`}>
                        {step.num}
                      </div>
                      {step.num !== "3" && <div className="w-0.5 h-12 bg-outline-variant my-1" />}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-label-md font-bold text-primary">{step.label}</p>
                      <p className="text-xs text-on-surface-variant">{step.desc}</p>
                      {step.active && (
                        <div className="w-full bg-surface-container h-1 mt-2 rounded-full overflow-hidden">
                          <div className={`bg-secondary h-full ${step.progress}`} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full -mr-10 -mt-10" />
              <h3 className="text-label-md font-bold uppercase tracking-widest text-secondary-fixed mb-3">
                Selected User
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-secondary-fixed overflow-hidden bg-surface-container-high">
                  <img
                    className="w-full h-full object-cover"
                    alt="Marcus Thorne"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOjwoJhzywJ1md6EZplH8yUSTRpTl_7qNzlXKKI1Argwnyf3sC3LrTrfdkPPefA46tDZSJTbCk07J5_mj380SpeFTNp-LNq5rxld4Wq2nkq-dinqILR9DmQ5RVDNCT2NrZbifY1jxl_-N18EBUDzJyEhPkTcle8w7nr58r64Agni7x9GJEbnhCaE20emvTnyZFp_ktZ4FoYXMdk2P5M444JhXbTOubQgAr41t7QAmFMR3BuZeqLAuKTA"
                  />
                </div>
                <div>
                  <p className="font-bold text-body-md">Marcus Thorne</p>
                  <p className="text-xs text-on-primary-fixed-variant">ID: FSP-88291-B</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-primary-fixed-variant">Account Type</span>
                  <span className="font-bold">Institutional</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-primary-fixed-variant">Risk Level</span>
                  <span className="text-secondary-fixed font-bold">High (HNW)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-4">
            <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant flex justify-between items-center">
                <h2 className="font-bold text-body-lg text-primary flex items-center gap-2">
                  <Icon name="person_search" className="text-secondary" />
                  User Identification
                </h2>
                <button className="text-secondary font-label-md hover:underline">Change User</button>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-label-md font-bold text-on-surface-variant block">Full Name (Legal)</label>
                  <input className="w-full border border-outline rounded-lg px-4 py-2.5 bg-surface-container-low font-body-md" type="text" defaultValue="Marcus Thorne" />
                </div>
                <div className="space-y-2">
                  <label className="text-label-md font-bold text-on-surface-variant block">Date of Birth</label>
                  <div className="relative">
                    <input className="w-full border border-outline rounded-lg px-4 py-2.5 bg-surface-container-low font-body-md" type="text" defaultValue="12 / 05 / 1978" />
                    <Icon name="calendar_today" className="absolute right-4 top-2.5 text-outline-variant" />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant">
                <h2 className="font-bold text-body-lg text-primary flex items-center gap-2">
                  <Icon name="verified_user" className="text-secondary" />
                  Tier 1: Core Verification
                </h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div className="space-y-2">
                    <label className="text-label-md font-bold text-on-surface-variant block">Bank Verification Number (BVN)</label>
                    <div className="flex gap-2">
                      <input className="flex-1 border border-outline rounded-lg px-4 py-2.5 font-body-md tracking-widest" type="password" defaultValue="22233344455" />
                      <button className="bg-surface-container px-4 rounded-lg text-primary hover:bg-surface-container-high transition-colors">
                        <Icon name="visibility" />
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant">Validated against Nigeria Central Bank records.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-md font-bold text-on-surface-variant block">Face Match (SmileID)</label>
                    <div className="border-2 border-dashed border-secondary/30 rounded-xl p-3 bg-secondary/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/10 transition-colors group">
                      <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mb-2 group-hover:scale-110 transition-transform">
                        <Icon name="face" />
                      </div>
                      <p className="font-bold text-sm text-primary">Process Biometric Match</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">SmileID SDK Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant">
                <h2 className="font-bold text-body-lg text-primary flex items-center gap-2">
                  <Icon name="badge" className="text-secondary" />
                  Tier 2: Enhanced Identity
                </h2>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-label-md font-bold text-on-surface-variant block">Passport Photo</label>
                  <div className="aspect-video bg-surface rounded-xl border border-outline-variant flex items-center justify-center relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col items-center text-center p-4">
                      <Icon name="cloud_upload" className="text-secondary mb-1" />
                      <span className="text-xs font-bold text-primary">Upload Passport</span>
                      <span className="text-[10px] text-on-surface-variant">JPG, PNG up to 5MB</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-label-md font-bold text-on-surface-variant block">National Identity Number (NIN)</label>
                  <div className="space-y-4">
                    <input className="w-full border border-outline rounded-lg px-4 py-2.5 font-body-md" placeholder="Enter 11-digit NIN" type="text" />
                    <div className="aspect-video bg-surface rounded-xl border border-outline-variant flex items-center justify-center cursor-pointer hover:bg-surface-container transition-colors">
                      <div className="flex flex-col items-center text-center p-4">
                        <Icon name="upload_file" className="text-outline mb-1" />
                        <span className="text-xs font-bold text-primary">Upload NIN Slip</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-label-md font-bold text-on-surface-variant block">Government Issued ID Card</label>
                  <div className="aspect-video bg-surface rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-surface-container transition-colors">
                    <Icon name="contact_page" className="text-outline mb-1" />
                    <span className="text-xs font-bold text-primary">Upload ID Front & Back</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-label-md font-bold text-on-surface-variant block">Utility Bill (Recent)</label>
                  <div className="aspect-video bg-surface rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-surface-container transition-colors">
                    <Icon name="receipt" className="text-outline mb-1" />
                    <span className="text-xs font-bold text-primary">Drag & Drop Utility Bill</span>
                    <span className="text-[10px] text-on-surface-variant">Dated within last 3 months</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant">
                <h2 className="font-bold text-body-lg text-primary flex items-center gap-2">
                  <Icon name="apartment" className="text-secondary" />
                  Tier 3: Residence Proof
                </h2>
              </div>
              <div className="p-4">
                <div className="mb-4 space-y-4">
                  <label className="text-label-md font-bold text-on-surface-variant block">Structured Address Details</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-outline mb-1 block">Street Address</label>
                      <input className="w-full border border-outline rounded-lg px-4 py-2 bg-surface-container-low font-body-md" placeholder="e.g. 123 Business Way" type="text" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-outline mb-1 block">City</label>
                      <input className="w-full border border-outline rounded-lg px-4 py-2 bg-surface-container-low font-body-md" placeholder="e.g. Lagos" type="text" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-outline mb-1 block">State / Province</label>
                      <input className="w-full border border-outline rounded-lg px-4 py-2 bg-surface-container-low font-body-md" placeholder="e.g. Lagos State" type="text" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-outline mb-1 block">Postal Code</label>
                      <input className="w-full border border-outline rounded-lg px-4 py-2 bg-surface-container-low font-body-md" placeholder="e.g. 100001" type="text" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-label-md font-bold text-on-surface-variant block">Address Verification Certificate</label>
                  <div className="w-full border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-surface transition-colors cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
                      <Icon name="verified" className="text-[32px]" />
                    </div>
                    <p className="font-bold text-primary mb-1">Upload Statutory Address Declaration</p>
                    <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                      Required for high-limit corporate accounts. Document must be signed and stamped by a recognized legal authority.
                    </p>
                    <div className="mt-6 flex gap-3">
                      <button className="px-4 py-2 bg-primary text-on-primary rounded text-xs font-bold hover:opacity-90">Browse Files</button>
                      <button className="px-4 py-2 border border-outline rounded text-xs font-bold hover:bg-surface-container">Download Template</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-4 py-3 border-b border-outline-variant">
                <h2 className="font-bold text-body-lg text-primary flex items-center gap-2">
                  <Icon name="notes" className="text-secondary" />
                  Additional Details & Admin Notes
                </h2>
              </div>
              <div className="p-4">
                <textarea
                  className="w-full border border-outline rounded-lg px-4 py-3 bg-surface-container-low font-body-md min-h-[120px]"
                  placeholder="Enter any additional metadata, verification notes, or internal flags here..."
                />
              </div>
            </section>

            <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-secondary/20 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
                  <Icon name="info" />
                </div>
                <div>
                  <p className="font-bold text-primary">Compliance Review</p>
                  <p className="text-sm text-on-surface-variant">Submission will be logged under admin ID: ADM-990-2</p>
                </div>
              </div>
              <button className="bg-secondary text-white px-6 py-3 rounded-xl font-bold text-body-md flex items-center gap-3 shadow-lg hover:shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Submit for Final Review
                <Icon name="arrow_forward" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
