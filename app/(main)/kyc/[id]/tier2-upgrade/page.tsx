"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { fetchKycSubmissionDetail, submitManualTier2UpgradeWithFiles } from "@/lib/api";
import { Icon } from "@/components/ui/Icon";

type FileField = "user_signature_url" | "user_photo_url" | "bill_proof_url" | "front_id_url";

export default function Tier2UpgradePage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const fileRefs = {
    user_signature_url: useRef<HTMLInputElement>(null),
    user_photo_url: useRef<HTMLInputElement>(null),
    bill_proof_url: useRef<HTMLInputElement>(null),
    front_id_url: useRef<HTMLInputElement>(null),
  };

  const [textFields, setTextField] = useState({
    nin: "",
    nin_issued_date: "",
    pep_status: "",
    street: "",
    nearest_land_mark: "",
    city: "",
    local_government: "",
    state: "",
    zip_code: "",
    country_code: "",
  });

  const [existingUrls, setExistingUrls] = useState<Record<string, string>>({});
  const [fileNames, setFileNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetchKycSubmissionDetail(id)
      .then((res) => {
        const d = res.data || res;
        setTextField({
          nin: d.nin ?? "",
          nin_issued_date: d.nin_issue_date ?? "",
          pep_status: d.pep_status ?? "",
          street: d.street ?? "",
          nearest_land_mark: d.nearest_land_mark ?? "",
          city: d.city ?? "",
          local_government: d.lga_of_residence ?? d.lga_of_origin ?? "",
          state: d.state ?? "",
          zip_code: d.zip_code ?? "",
          country_code: d.country_code ?? "",
        });
        setExistingUrls({
          user_signature_url: d.user_signature_url ?? "",
          front_id_url: d.front_id_url ?? "",
          user_photo_url: "",
          bill_proof_url: d.bill_proof_url ?? "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  function setText(field: string, value: string) {
    setTextField((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(field: FileField) {
    const file = fileRefs[field].current?.files?.[0];
    if (file) {
      setFileNames((prev) => ({ ...prev, [field]: file.name }));
    }
  }

  function clearFile(field: FileField) {
    if (fileRefs[field].current) fileRefs[field].current.value = "";
    setFileNames((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setResult(null);
    setSubmitting(true);
    try {
      const data: Record<string, string | Blob> = {};
      for (const [key, value] of Object.entries(textFields)) {
        if (value) data[key] = value;
      }
      for (const field of Object.keys(fileRefs) as FileField[]) {
        const file = fileRefs[field].current?.files?.[0];
        if (file) {
          data[field] = file;
        }
      }
      await submitManualTier2UpgradeWithFiles(id, data);
      setResult({ ok: true, msg: "Tier 2 upgrade submitted successfully." });
    } catch (err: unknown) {
      setResult({ ok: false, msg: err instanceof Error ? err.message : "Submission failed" });
    } finally {
      setSubmitting(false);
    }
  }

  function input(field: string, placeholder: string) {
    const key = field as keyof typeof textFields;
    return (
      <input
        type="text"
        className="w-full px-4 py-2.5 text-body-md border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
        placeholder={placeholder}
        value={textFields[key]}
        onChange={(e) => setText(field, e.target.value)}
      />
    );
  }

  function fileUpload(field: FileField, label: string, accept: string) {
    const hasUrl = !!existingUrls[field];
    const hasFile = !!fileNames[field];
    return (
      <div>
        <label className="font-label-md text-on-surface-variant block mb-1">{label}</label>
        <input
          ref={fileRefs[field]}
          type="file"
          accept={accept}
          onChange={() => handleFileChange(field)}
          className="hidden"
        />
        {hasUrl && !hasFile && (
          <div className="flex items-center gap-2 px-4 py-2.5 border border-outline-variant rounded-lg bg-surface-container-lowest mb-2">
            <Icon name="link" className="text-on-surface-variant text-sm shrink-0" />
            <a
              href={existingUrls[field]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-sm text-secondary truncate hover:underline"
            >
              {existingUrls[field]}
            </a>
          </div>
        )}
        <button
          type="button"
          onClick={() => fileRefs[field].current?.click()}
          className="w-full flex items-center gap-3 px-4 py-3 border border-dashed border-outline-variant rounded-lg bg-surface-container-lowest hover:bg-surface-container/50 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-lg bg-secondary-fixed/20 flex items-center justify-center text-secondary shrink-0">
            <Icon name="upload_file" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-body-sm font-semibold text-primary truncate">
              {hasFile ? fileNames[field] : hasUrl ? "Tap to replace file" : "Choose file"}
            </p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
              {accept.replace(/,/g, ", ")}
            </p>
          </div>
          {hasFile && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearFile(field); }}
              className="p-1 rounded-full hover:bg-surface-container transition-colors"
            >
              <Icon name="close" className="text-on-surface-variant text-sm" />
            </button>
          )}
          {!hasFile && hasUrl && (
            <Icon name="check_circle" className="text-[#2E7D32] shrink-0" filled />
          )}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-body-md text-on-surface-variant">Loading existing data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[900px] mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-on-surface-variant hover:text-primary transition-colors">
          <Icon name="arrow_back" />
        </button>
        <div>
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-1">
            <Link className="hover:text-primary" href="/kyc">KYC Queue</Link>
            <span>/</span>
            <span className="text-primary font-semibold">Tier 2 Upgrade</span>
          </nav>
          <h2 className="text-headline-lg text-primary">Manual Tier 2 Upgrade</h2>
          <p className="text-body-sm text-on-surface-variant">KYC Submission #{id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-outline-variant/30">
            <Icon name="badge" className="text-secondary" />
            <h3 className="text-label-md font-bold uppercase tracking-wider text-primary">NIN & Identity</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-label-md text-on-surface-variant block mb-1">NIN</label>
              {input("nin", "11-digit NIN")}
            </div>
            <div>
              <label className="font-label-md text-on-surface-variant block mb-1">NIN Issue Date</label>
              {input("nin_issued_date", "e.g. 2024-01-15")}
            </div>
            <div>
              <label className="font-label-md text-on-surface-variant block mb-1">PEP Status</label>
              <select
                className="w-full px-4 py-2.5 text-body-md border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
                value={textFields.pep_status}
                onChange={(e) => setText("pep_status", e.target.value)}
              >
                <option value="">Select PEP status...</option>
                <option value="YES">Yes</option>
                <option value="NO">No</option>
              </select>
            </div>
            {fileUpload("user_signature_url", "User Signature", ".png,.jpg,.jpeg,.pdf")}
            {fileUpload("front_id_url", "Front ID", ".png,.jpg,.jpeg,.pdf")}
            {fileUpload("user_photo_url", "User Photo", ".png,.jpg,.jpeg")}
            <div className="md:col-span-2">
              {fileUpload("bill_proof_url", "Bill Proof", ".png,.jpg,.jpeg,.pdf")}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-outline-variant/30">
            <Icon name="home_pin" className="text-secondary" />
            <h3 className="text-label-md font-bold uppercase tracking-wider text-primary">Address Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="font-label-md text-on-surface-variant block mb-1">Street</label>
              {input("street", "e.g. 123 Main Street")}
            </div>
            <div className="md:col-span-2">
              <label className="font-label-md text-on-surface-variant block mb-1">Nearest Land Mark</label>
              {input("nearest_land_mark", "e.g. Opposite City Mall")}
            </div>
            <div>
              <label className="font-label-md text-on-surface-variant block mb-1">City</label>
              {input("city", "e.g. Lagos")}
            </div>
            <div>
              <label className="font-label-md text-on-surface-variant block mb-1">Local Government</label>
              {input("local_government", "e.g. Ikeja")}
            </div>
            <div>
              <label className="font-label-md text-on-surface-variant block mb-1">State</label>
              {input("state", "e.g. Lagos State")}
            </div>
            <div>
              <label className="font-label-md text-on-surface-variant block mb-1">ZIP Code</label>
              {input("zip_code", "e.g. 100001")}
            </div>
            <div>
              <label className="font-label-md text-on-surface-variant block mb-1">Country Code</label>
              {input("country_code", "e.g. NG")}
            </div>
          </div>
        </div>

        {result && (
          <div className={`px-4 py-3 rounded-lg text-body-sm flex items-start gap-2 ${
            result.ok ? "bg-[#E8F5E9] text-[#2E7D32]" : "bg-[#FFEBEE] text-[#C62828]"
          }`}>
            <Icon name={result.ok ? "check_circle" : "error"} className="text-[18px] shrink-0 mt-0.5" />
            <span>{result.msg}</span>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href={`/kyc/${id}`}
            className="px-5 py-2.5 border border-outline-variant rounded-lg font-label-md hover:bg-surface-container transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-secondary text-on-secondary rounded-lg font-label-md flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-on-secondary border-t-transparent rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <>
                <Icon name="verified_user" className="text-[16px]" />
                Submit Tier 2 Upgrade
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
