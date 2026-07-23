"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserDetail, sendMailToUser, updateUserRestriction, type UserDetail as UserDetailType } from "@/lib/api";
import { Icon } from "@/components/ui/Icon";

const statusStyles: Record<string, string> = {
  active: "bg-[#E8F5E9] text-[#2E7D32]",
  suspended: "bg-[#FFEBEE] text-[#C62828]",
  inactive: "bg-[#FFF3E0] text-[#EF6C00]",
};

const txnTypeStyles: Record<string, string> = {
  transfer: "bg-[#E8F5E9] text-[#2E7D32]",
  bill: "bg-[#FFF3E0] text-[#EF6C00]",
  reversed: "bg-[#FFEBEE] text-[#C62828]",
  funding: "bg-[#E3F2FD] text-[#1565C0]",
};

function SectionCard({ title, icon, action, children }: { title: string; icon?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
      <div className="mb-4 flex items-center justify-between border-b border-outline-variant/30 pb-3">
        <div className="flex items-center gap-2">
          {icon && <Icon name={icon} className="text-secondary" />}
          <h3 className="text-label-md font-bold uppercase tracking-wider text-primary">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, className = "" }: { label: string; value: React.ReactNode; className?: string }) {
  if (value === "" || value === null || value === undefined) return null;
  return (
    <div className={className}>
      <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">{label}</p>
      <p className="mt-0.5 text-body-sm font-semibold text-primary break-words">{value}</p>
    </div>
  );
}

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const [showRestrictionModal, setShowRestrictionModal] = useState(false);
  const [restrict, setRestrict] = useState(true);
  const [reasonsForRestriction, setReasonsForRestriction] = useState("");
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [submittingRestriction, setSubmittingRestriction] = useState(false);
  const [restrictionResult, setRestrictionResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const userId = params?.id as string;

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetchUserDetail(userId)
      .then((res) => setUser(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load user"))
      .finally(() => setLoading(false));
  }, [userId]);

  function openEmailModal() {
    setEmailSubject("");
    setEmailMessage("");
    setEmailResult(null);
    setShowEmailModal(true);
  }

  function openRestrictionModal() {
    setRestrict(true);
    setReasonsForRestriction("");
    setIncorrectAttempts(0);
    setRestrictionResult(null);
    setShowRestrictionModal(true);
  }

  async function handleRestrictionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setRestrictionResult(null);
    setSubmittingRestriction(true);
    try {
      const body: { restriction: boolean; reasons_for_restriction?: string; incorrect_attempts?: number } = { restriction: restrict };
      if (restrict) {
        body.reasons_for_restriction = reasonsForRestriction;
        body.incorrect_attempts = incorrectAttempts;
      }
      await updateUserRestriction(user.id, body);
      setRestrictionResult({ ok: true, msg: restrict ? "User restricted successfully." : "Restriction removed successfully." });
      setTimeout(() => setShowRestrictionModal(false), 1500);
    } catch (err: unknown) {
      setRestrictionResult({ ok: false, msg: err instanceof Error ? err.message : "Failed to update restriction" });
    } finally {
      setSubmittingRestriction(false);
    }
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setEmailResult(null);
    setSendingEmail(true);
    try {
      await sendMailToUser(user.email, emailSubject, emailMessage);
      setEmailResult({ ok: true, msg: "Email sent successfully." });
      setTimeout(() => setShowEmailModal(false), 1500);
    } catch (err: unknown) {
      setEmailResult({ ok: false, msg: err instanceof Error ? err.message : "Failed to send email" });
    } finally {
      setSendingEmail(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-body-md text-on-surface-variant">Loading user details...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Icon name="error_outline" className="text-4xl text-error" />
        <p className="text-body-md text-error">{error || "User not found"}</p>
        <Link href="/users" className="text-secondary font-bold hover:underline">
          Back to User Management
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="text-on-surface-variant hover:text-primary transition-colors">
          <Icon name="arrow_back" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-headline-md font-bold text-primary">User Details</h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusStyles[user.status] || ""}`}>
              {user.status}
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant">User ID: #{user.id}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <SectionCard title="Account Details" icon="badge">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-outline-variant/30">
              <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg uppercase">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-headline-md text-primary font-semibold">{user.name}</p>
                <p className="text-body-sm text-on-surface-variant">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
              <Field label="Phone" value={user.phone} />
              <Field label="Date of Birth" value={user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" }) : undefined} />
              <Field label="Gender" value={user.gender} />
              <Field label="Nationality" value={user.nationality} />
              <Field label="Account Number" value={<span className="font-mono">{user.account_number}</span>} />
              <Field label="Bank" value={user.bank_name} />
              <Field label="Bank Code" value={user.bank_code} />
              <Field label="BVN" value={<span className="font-mono">{user.bvn}</span>} />
              <Field label="Tier" value={user.tier} />
              <Field label="KYC Status" value={
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${statusStyles[user.kyc_status] || ""}`}>
                  {user.kyc_status}
                </span>
              } />
              <Field label="Status" value={
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${statusStyles[user.status] || ""}`}>
                  {user.status}
                </span>
              } />
              <Field label="Address" value={user.address} className="col-span-2 md:col-span-3" />
            </div>
          </SectionCard>

          <SectionCard title="Balance Tracking" icon="account_balance_wallet">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-primary-container/10 border border-outline-variant">
                <p className="font-label-md text-on-surface-variant uppercase tracking-wider">Current Balance</p>
                <p className="text-headline-md font-mono font-bold text-primary mt-1">{formatCurrency(user.current_balance)}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary-fixed/10 border border-outline-variant">
                <p className="font-label-md text-on-surface-variant uppercase tracking-wider">Available Balance</p>
                <p className="text-headline-md font-mono font-bold text-primary mt-1">{formatCurrency(user.available_balance)}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant">
                    <th className="pb-2 pr-3">Transaction ID</th>
                    <th className="pb-2 pr-3">User</th>
                    <th className="pb-2 pr-3">Type</th>
                    <th className="pb-2 pr-3">Transaction Type</th>
                    <th className="pb-2 pr-3 text-right">Balance Before</th>
                    <th className="pb-2 pr-3 text-right">Balance After</th>
                    <th className="pb-2 pr-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {(user.ledger ?? []).map((entry) => (
                    <tr key={entry.transaction_id} className="hover:bg-surface-container/50 transition-colors">
                      <td className="py-2.5 pr-3 text-[11px] font-mono text-outline">{entry.transaction_id}</td>
                      <td className="py-2.5 pr-3">
                        <p className="text-body-sm font-semibold text-primary">{entry.user.name}</p>
                        <p className="text-[10px] text-outline">{entry.user.email}</p>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${
                          entry.type === "credit" ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FFEBEE] text-[#C62828]"
                        }`}>
                          {entry.type}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${txnTypeStyles[entry.transaction_type] || ""}`}>
                          {entry.transaction_type}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-body-sm font-mono text-right text-on-surface-variant">{formatCurrency(entry.balance_before)}</td>
                      <td className="py-2.5 pr-3 text-body-sm font-mono text-right text-primary font-semibold">{formatCurrency(entry.balance_after)}</td>
                      <td className="py-2.5 text-right text-[11px] text-on-surface-variant whitespace-nowrap">
                        {formatDate(entry.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <SectionCard title="Account Summary" icon="summary">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
                <p className="text-body-sm text-on-surface-variant">Total Transactions</p>
                <p className="text-body-md font-semibold text-primary">{user.total_transactions?.toLocaleString() ?? "—"}</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
                <p className="text-body-sm text-on-surface-variant">Total Deposits</p>
                <p className="text-body-md font-semibold text-[#2E7D32]">{user.total_deposits != null ? formatCurrency(user.total_deposits) : "—"}</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
                <p className="text-body-sm text-on-surface-variant">Total Withdrawals</p>
                <p className="text-body-md font-semibold text-error">{user.total_withdrawals != null ? formatCurrency(user.total_withdrawals) : "—"}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-body-sm text-on-surface-variant">Net Flow</p>
                <p className="text-body-md font-semibold text-primary">
                  {user.total_deposits != null && user.total_withdrawals != null ? formatCurrency(user.total_deposits - user.total_withdrawals) : "—"}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Quick Actions" icon="bolt">
            <div className="space-y-2">
              <button
                onClick={openRestrictionModal}
                className="w-full py-2.5 px-4 bg-primary text-on-primary rounded-lg font-label-md flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Icon name="block" className="text-[16px]" />
                Restrict User
              </button>
              <button
                onClick={openEmailModal}
                className="w-full py-2.5 px-4 border border-outline-variant rounded-lg font-label-md flex items-center justify-center gap-2 hover:bg-surface-container transition-colors"
              >
                <Icon name="mail" className="text-[16px]" />
                Send Email
              </button>
              <button className="w-full py-2.5 px-4 border border-outline-variant rounded-lg font-label-md flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
                <Icon name="download" className="text-[16px]" />
                Export Statement
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Restriction" icon="block">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">Status</p>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase flex items-center gap-1 ${
                  user.restriction ? "bg-[#FFEBEE] text-[#C62828]" : "bg-[#E8F5E9] text-[#2E7D32]"
                }`}>
                  <Icon name={user.restriction ? "block" : "check_circle"} className="text-[12px]" />
                  {user.restriction ? "Restricted" : "Active"}
                </span>
              </div>
              <Field label="Reasons" value={user.reasons_for_restriction} />
              <Field label="Incorrect Attempts" value={user.incorrect_attempts != null ? user.incorrect_attempts : 0} />
            </div>
          </SectionCard>

          <SectionCard title="Metadata" icon="info">
            <div className="space-y-3">
              <Field label="Created" value={user.created_at ? formatDate(user.created_at) : undefined} />
              <Field label="Last Login" value={user.last_login ? formatDate(user.last_login) : undefined} />
              <Field label="Account Number" value={<span className="font-mono">{user.account_number}</span>} />
            </div>
          </SectionCard>
        </div>
      </div>

      <footer className="mt-6 border-t border-outline-variant pt-4">
        <Link href="/users" className="text-primary font-label-md flex items-center gap-1 hover:underline w-fit">
          <Icon name="arrow_back" className="text-sm" />
          Back to User Management
        </Link>
      </footer>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => !sendingEmail && setShowEmailModal(false)}>
          <div className="w-full max-w-xl bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
                  <Icon name="mail" className="text-primary" />
                </div>
                <div>
                  <h3 className="text-headline-md text-primary">Send Email</h3>
                  <p className="text-body-sm text-on-surface-variant">To: {user.email}</p>
                </div>
              </div>
              <button onClick={() => !sendingEmail && setShowEmailModal(false)} className="p-1.5 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                <Icon name="close" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="font-label-md text-on-surface-variant block mb-1">Subject</label>
                <input
                  className="w-full px-4 py-2.5 text-body-md border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. Account Update"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="font-label-md text-on-surface-variant block mb-1">Message</label>
                <textarea
                  className="w-full px-4 py-2.5 text-body-md border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors resize-none"
                  rows={6}
                  placeholder="Write your message here..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  required
                />
              </div>

              {emailResult && (
                <div className={`px-4 py-3 rounded-lg text-body-sm flex items-start gap-2 ${
                  emailResult.ok ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FFEBEE] text-[#C62828]"
                }`}>
                  <Icon name={emailResult.ok ? "check_circle" : "error"} className="text-[18px] shrink-0 mt-0.5" />
                  <span>{emailResult.msg}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  disabled={sendingEmail}
                  className="px-4 py-2.5 border border-outline-variant rounded-lg font-label-md hover:bg-surface-container transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail || !emailSubject || !emailMessage}
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-md flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingEmail ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Icon name="send" className="text-[16px]" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRestrictionModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => !submittingRestriction && setShowRestrictionModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-xl"
            style={{ animation: "modalIn 0.25s ease-out" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center">
                  <Icon name="block" className="text-error" />
                </div>
                <div>
                  <h3 className="text-headline-md text-primary">
                    {restrict ? "Restrict User" : "Remove Restriction"}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">{user.name}</p>
                </div>
              </div>
              <button
                onClick={() => !submittingRestriction && setShowRestrictionModal(false)}
                className="p-1.5 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
              >
                <Icon name="close" />
              </button>
            </div>

            <form onSubmit={handleRestrictionSubmit} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container/50">
                <button
                  type="button"
                  onClick={() => setRestrict(true)}
                  className={`flex-1 py-2 px-3 rounded-lg font-label-md transition-all duration-200 ${
                    restrict
                      ? "bg-error text-on-error shadow-sm scale-[1.02]"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-hover"
                  }`}
                >
                  <Icon name="block" className="text-[14px] inline mr-1.5" />
                  Restrict
                </button>
                <button
                  type="button"
                  onClick={() => setRestrict(false)}
                  className={`flex-1 py-2 px-3 rounded-lg font-label-md transition-all duration-200 ${
                    !restrict
                      ? "bg-primary text-on-primary shadow-sm scale-[1.02]"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-hover"
                  }`}
                >
                  <Icon name="check_circle" className="text-[14px] inline mr-1.5" />
                  Unrestrict
                </button>
              </div>

              {restrict && (
                <div className="space-y-4" style={{ animation: "slideIn 0.2s ease-out" }}>
                  <div>
                    <label className="font-label-md text-on-surface-variant block mb-1">Reason for Restriction</label>
                    <textarea
                      className="w-full px-4 py-2.5 text-body-md border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors resize-none"
                      rows={3}
                      placeholder="e.g. Suspicious activity detected"
                      value={reasonsForRestriction}
                      onChange={(e) => setReasonsForRestriction(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-label-md text-on-surface-variant block mb-1">Incorrect Attempts</label>
                    <input
                      type="number"
                      min={0}
                      className="w-full px-4 py-2.5 text-body-md border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
                      value={incorrectAttempts}
                      onChange={(e) => setIncorrectAttempts(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
              )}

              {!restrict && (
                <div className="p-3 rounded-lg bg-surface-container/50 text-body-sm text-on-surface-variant" style={{ animation: "slideIn 0.2s ease-out" }}>
                  <Icon name="info" className="text-[16px] inline mr-1.5 align-text-bottom" />
                  Restriction will be removed and incorrect attempts will be reset to 0.
                </div>
              )}

              {restrictionResult && (
                <div className={`px-4 py-3 rounded-lg text-body-sm flex items-start gap-2 ${
                  restrictionResult.ok ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FFEBEE] text-[#C62828]"
                }`}>
                  <Icon name={restrictionResult.ok ? "check_circle" : "error"} className="text-[18px] shrink-0 mt-0.5" />
                  <span>{restrictionResult.msg}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRestrictionModal(false)}
                  disabled={submittingRestriction}
                  className="px-4 py-2.5 border border-outline-variant rounded-lg font-label-md hover:bg-surface-container transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRestriction || (restrict && !reasonsForRestriction)}
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-md flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingRestriction ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Icon name={restrict ? "block" : "check_circle"} className="text-[16px]" />
                      {restrict ? "Apply Restriction" : "Remove Restriction"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
