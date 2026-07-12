"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/components/AuthContext";

export function OTPForm() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyOTP, resendOTP, isLoading, error: authError, clearError } = useAuth();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback((index: number, value: string) => {
    if (value.length > 1) value = value.slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);
    clearError();

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp, clearError]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const focusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  }, [otp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length === 6) {
      setShowSuccess(true);
      await verifyOTP(code);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const handleResend = useCallback(async () => {
    setTimeLeft(120);
    await resendOTP();
  }, [resendOTP]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {authError && (
          <div className="p-3 bg-error-container text-on-error-container rounded-lg text-body-sm flex items-start gap-2">
            <Icon name="error" className="mt-0.5 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <div className="flex justify-between gap-1 md:gap-2" id="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              autoFocus={index === 0}
              className={`w-12 h-16 md:w-14 md:h-20 text-center text-headline-md font-bold bg-surface-container-low border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${
                error ? "border-error animate-shake" : "border-outline-variant"
              }`}
              maxLength={1}
              type="number"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isLoading}
            />
          ))}
        </div>

        <div className="flex items-center justify-between py-2 border-t border-b border-outline-variant/20">
          <div className={`flex items-center gap-1 text-on-surface-variant font-label-md ${timeLeft <= 0 ? "opacity-40" : ""}`}>
            <Icon name="schedule" className="text-[18px]" />
            <span>Code expires in:</span>
            <span className="text-secondary font-bold tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>
          <button
            type="button"
            disabled={timeLeft > 0}
            onClick={handleResend}
            className="text-primary font-label-md hover:underline disabled:opacity-30 disabled:no-underline transition-all"
          >
            Resend Code
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-secondary text-white font-label-md tracking-wider uppercase rounded-lg hover:bg-secondary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying...
            </span>
          ) : (
            <>
              <span>Verify & Continue</span>
              <Icon name="arrow_forward_ios" className="text-[20px] group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md transition-opacity duration-500 ${
          showSuccess ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-xl p-8 max-w-[320px] w-full text-center shadow-2xl border border-secondary/20">
          <div className="w-16 h-16 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-gold">
            <Icon name="verified_user" className="text-[32px]" filled />
          </div>
          <h3 className="text-headline-md text-on-surface mb-2">Verification Successful</h3>
          <p className="text-body-sm text-on-surface-variant mb-4">
            Access granted. Redirecting to your terminal dashboard...
          </p>
          <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
            <div className="h-full bg-secondary animate-loading-bar" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }

        @keyframes pulse-gold {
          0% { box-shadow: 0 0 0 0 rgba(253, 202, 96, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(253, 202, 96, 0); }
          100% { box-shadow: 0 0 0 0 rgba(253, 202, 96, 0); }
        }
        .animate-pulse-gold { animation: pulse-gold 2s infinite; }

        @keyframes loading-bar { to { width: 100%; } }
        .animate-loading-bar { animation: loading-bar 2s ease-in-out forwards; width: 0; }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </>
  );
}
