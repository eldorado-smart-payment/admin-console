"use client";

import { useState } from "react";
import { sendBatchEmail, sendBatchNotification } from "@/lib/api";
import { Icon } from "@/components/ui/Icon";

export default function NotificationsPage() {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const [pushTitle, setPushTitle] = useState("");
  const [pushMessage, setPushMessage] = useState("");
  const [sendingPush, setSendingPush] = useState(false);
  const [pushResult, setPushResult] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailResult(null);
    setSendingEmail(true);
    try {
      await sendBatchEmail(emailSubject, emailMessage);
      setEmailResult({ ok: true, msg: "Maintenance email sent to all users." });
      setEmailSubject("");
      setEmailMessage("");
    } catch (err: unknown) {
      setEmailResult({ ok: false, msg: err instanceof Error ? err.message : "Failed to send email" });
    } finally {
      setSendingEmail(false);
    }
  }

  async function handleSendPush(e: React.FormEvent) {
    e.preventDefault();
    setPushResult(null);
    setSendingPush(true);
    try {
      await sendBatchNotification(pushTitle, pushMessage);
      setPushResult({ ok: true, msg: "Push notification sent to all users." });
      setPushTitle("");
      setPushMessage("");
    } catch (err: unknown) {
      setPushResult({ ok: false, msg: err instanceof Error ? err.message : "Failed to send notification" });
    } finally {
      setSendingPush(false);
    }
  }

  return (
    <>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-headline-lg text-primary">Notification Center</h2>
          <p className="text-body-md text-on-surface-variant">
            Broadcast messages and notifications to all platform users.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
              <Icon name="mail" className="text-primary" />
            </div>
            <div>
              <h3 className="text-headline-md text-primary">Broadcast Email</h3>
              <p className="text-body-sm text-on-surface-variant">Send a maintenance email to all users.</p>
            </div>
          </div>

          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="font-label-md text-on-surface-variant block mb-1">Subject</label>
              <input
                className="w-full px-4 py-2.5 text-body-md border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. Scheduled Maintenance"
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
                placeholder="Write your email message here..."
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={sendingEmail}
              className="w-full py-3 bg-primary text-on-primary rounded-lg font-label-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingEmail ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <>
                  <Icon name="send" className="text-[18px]" />
                  Send Email
                </>
              )}
            </button>
          </form>

          {emailResult && (
            <div
              className={`mt-4 px-4 py-3 rounded-lg text-body-sm flex items-start gap-2 ${
                emailResult.ok
                  ? "bg-[#E8F5E9] text-[#2E7D32]"
                  : "bg-[#FFEBEE] text-[#C62828]"
              }`}
            >
              <Icon name={emailResult.ok ? "check_circle" : "error"} className="text-[18px] shrink-0 mt-0.5" />
              <span>{emailResult.msg}</span>
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center">
              <Icon name="notifications" className="text-secondary" />
            </div>
            <div>
              <h3 className="text-headline-md text-primary">Push Notification</h3>
              <p className="text-body-sm text-on-surface-variant">Send a push notification to all users.</p>
            </div>
          </div>

          <form onSubmit={handleSendPush} className="space-y-4">
            <div>
              <label className="font-label-md text-on-surface-variant block mb-1">Title</label>
              <input
                className="w-full px-4 py-2.5 text-body-md border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. System Update"
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-label-md text-on-surface-variant block mb-1">Message</label>
              <textarea
                className="w-full px-4 py-2.5 text-body-md border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors resize-none"
                rows={6}
                placeholder="Write your notification message here..."
                value={pushMessage}
                onChange={(e) => setPushMessage(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={sendingPush}
              className="w-full py-3 bg-secondary text-on-secondary rounded-lg font-label-md flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingPush ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-on-secondary border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <>
                  <Icon name="notifications" className="text-[18px]" />
                  Send Notification
                </>
              )}
            </button>
          </form>

          {pushResult && (
            <div
              className={`mt-4 px-4 py-3 rounded-lg text-body-sm flex items-start gap-2 ${
                pushResult.ok
                  ? "bg-[#E8F5E9] text-[#2E7D32]"
                  : "bg-[#FFEBEE] text-[#C62828]"
              }`}
            >
              <Icon name={pushResult.ok ? "check_circle" : "error"} className="text-[18px] shrink-0 mt-0.5" />
              <span>{pushResult.msg}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
