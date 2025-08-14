// 'use client'; // ← uncomment if using Next.js App Router

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5Qrcode } from "html5-qrcode";

export interface CertifiedLabubuProps {
  className?: string;
}

/* =======================
   Pop Mart URL guard (inline)
   ======================= */
type GuardResult =
  | { ok: true; url: URL }
  | { ok: false; input: string; reason: string };

const OFFICIAL_HOSTS = new Set<string>([
  "fwsy.popmart.com", // primary verification
  "www.popmart.com",
  "popmart.com",
]);

const REDIRECT_PREFIXES = ["ppmt."]; // e.g. ppmt.*.popmart.com

function toUrl(raw: string): URL | null {
  try {
    const trimmed = raw.trim();
    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(candidate);
  } catch {
    return null;
  }
}

function isOfficialHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (OFFICIAL_HOSTS.has(host)) return true;
  if (host.endsWith(".popmart.com") && REDIRECT_PREFIXES.some((p) => host.startsWith(p))) {
    return true;
  }
  return false;
}

function guardScannedValue(raw: string): GuardResult {
  if (!raw || typeof raw !== "string") {
    return { ok: false, input: raw, reason: "Empty or invalid scan result." };
  }
  const url = toUrl(raw);
  if (!url) {
    return { ok: false, input: raw, reason: "Not a valid URL." };
  }

  const shorteners = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "shorturl.at"];
  if (shorteners.includes(url.hostname.toLowerCase())) {
    return {
      ok: false,
      input: raw,
      reason: "Shortened URL detected. Only direct Pop Mart links are allowed.",
    };
  }

  if (!isOfficialHost(url.hostname)) {
    return {
      ok: false,
      input: raw,
      reason: `“${url.hostname}” is not an official Pop Mart domain.`,
    };
  }

  return { ok: true, url };
}
/* ======================= */

export default function CertifiedLabubu({ className }: CertifiedLabubuProps) {
  const [openScanner, setOpenScanner] = useState(false);
  const [openManual, setOpenManual] = useState(false);

  const [error, setError] = useState("");
  const [scanned, setScanned] = useState("");

  const [manualCode, setManualCode] = useState("");
  const [manualError, setManualError] = useState("");
  const [manualReady, setManualReady] = useState(false);

  // Camera scanner
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const cameraContainerId = "html5qr-code-camera";

  // File scanner
  const fileQrRef = useRef<Html5Qrcode | null>(null);
  const filePreviewId = "html5qr-file-preview";
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");

  /* ---------- Unified decode handler uses the guard ---------- */
  const handleDecodedText = useCallback((value: string) => {
    const verdict = guardScannedValue(value);

    if (!verdict.ok) {
      setError(verdict.reason);
      setScanned(value);
      return;
    }

    setError("");
    setScanned(verdict.url.toString());
    // ✅ Safe to open: official Pop Mart verification / redirector
    window.location.assign(verdict.url.toString());
  }, []);

  /* ---------- Start/stop camera scanner when toggled ---------- */
  useEffect(() => {
    if (!openScanner) {
      // Clean up any previous scanner UI
      const el = document.getElementById(cameraContainerId);
      if (el) el.innerHTML = "";
      scannerRef.current?.clear().catch(() => {});
      scannerRef.current = null;
      return;
    }

    const scanner = new Html5QrcodeScanner(
      cameraContainerId,
      {
        fps: 10,
        qrbox: { width: 280, height: 280 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => handleDecodedText(decodedText),
      (scanErr) => {
        const msg = typeof scanErr === "string" ? scanErr : String(scanErr ?? "");
        // Ignore frequent “NotFoundException” noise
        if (!/NotFound/i.test(msg)) setError(msg || "Camera read error");
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, [openScanner, handleDecodedText]);

  /* ---------- File upload → scan ---------- */
  const onPickImage = () => fileInputRef.current?.click();

  const onFileSelected: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image
    const url = URL.createObjectURL(file);
    setFilePreviewUrl(url);

    // Ensure Html5Qrcode instance exists for file scanning
    if (!fileQrRef.current) {
      fileQrRef.current = new Html5Qrcode(filePreviewId);
    }

    try {
      // true = show image in preview element
      const decoded = await fileQrRef.current.scanFile(file, true);
      // decoded is the text content of QR
      handleDecodedText(decoded);
    } catch (err: any) {
      const msg = typeof err === "string" ? err : err?.message || "Could not decode QR from image.";
      setError(msg);
    } finally {
      // Keep preview visible; revoke old object URL when new image selected or when component unmounts
    }
  };

  // Revoke preview URL on unmount or when changed
  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      if (fileQrRef.current) {
        try {
          fileQrRef.current.clear();
        } catch {}
        fileQrRef.current = null;
      }
    };
  }, [filePreviewUrl]);

  /* ---------- Manual scratch-code helpers ---------- */
  const sanitize = (s: string) => s.replace(/[\s-]+/g, "").toUpperCase();
  const validateManual = (raw: string) => {
    const code = sanitize(raw);
    if (!/^[A-Z0-9]+$/.test(code)) return { ok: false, msg: "Use letters and numbers only." };
    if (code.length < 8) return { ok: false, msg: "Code looks too short." };
    if (code.length > 40) return { ok: false, msg: "Code looks too long." };
    return { ok: true, code };
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setManualCode(raw);
    setManualReady(false);
    const v = validateManual(raw);
    setManualError(v.ok ? "" : v.msg);
  };

  const handleManualPrepare = () => {
    const v = validateManual(manualCode);
    if (!v.ok) {
      setManualError(v.msg);
      setManualReady(false);
      return;
    }
    setManualError("");
    setManualReady(true);
  };

  const handleCopy = async () => {
    const v = validateManual(manualCode);
    if (!v.ok) return;
    try {
      await navigator.clipboard.writeText(v.code!);
    } catch {}
  };

  const openOfficialHelp = () => {
    window.open("https://www.popmart.com/en/authenticity", "_blank", "noopener,noreferrer");
  };

  const tips = useMemo(
    () => [
      "Tip: Use the rear camera for faster focus.",
      "We only open Pop Mart’s official verification domains.",
    ],
    []
  );

  return (
    <aside
      className={`rounded-2xl border p-6 shadow-sm ${className || ""}`}
      style={{
        borderColor: "var(--color-accent)",
        background:
          "linear-gradient(135deg, rgba(255, 223, 186, 0.1), rgba(255, 192, 203, 0.1))",
      }}
    >
      <h2
        className="text-2xl font-bold mb-4"
        style={{
          background:
            "linear-gradient(135deg, var(--color-accent), var(--color-accent-2))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Labubu Certificate
      </h2>

      <div className="space-y-4">
        {/* --- Inline Scanner Toggle (camera) --- */}
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setOpenScanner((v) => !v)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium border transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent), var(--color-accent-2))",
              color: "white",
              borderColor: "transparent",
            }}
          >
            {openScanner ? "Hide Camera Scanner" : "Scan with Camera"}
          </button>

          {/* --- File upload trigger --- */}
          <button
            type="button"
            onClick={onPickImage}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium border transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "white",
              color: "var(--color-accent)",
              borderColor: "var(--color-accent)",
              borderWidth: 1,
            }}
          >
            Scan from Image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileSelected}
          />
        </div>

        {/* Camera scanner panel */}
        {openScanner && (
          <div className="mt-2 rounded-2xl border bg-white p-3">
            <h3 className="text-lg font-semibold mb-2">Scan Pop Mart authenticity QR (Camera)</h3>
            <div id={cameraContainerId} className="rounded-xl overflow-hidden border" />
          </div>
        )}

        {/* File preview panel (optional, shown once a file is chosen) */}
        {filePreviewUrl && (
          <div className="mt-2 rounded-2xl border bg-white p-3">
            <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
            <div className="rounded-xl overflow-hidden border">
              {/* Html5Qrcode shows the scanned image into this element when scanFile(..., true) */}
              <div id={filePreviewId} />
            </div>
          </div>
        )}

        {/* Feedback + tips */}
        <div className="text-sm">
          {error && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
              {error} We only open: <code>fwsy.popmart.com</code>, <code>popmart.com</code>, and{" "}
              <code>ppmt.*.popmart.com</code>.
            </div>
          )}
          {scanned && (
            <p className="mt-2 break-all text-gray-600">
              Scanned: <span className="font-mono">{scanned}</span>
            </p>
          )}
        </div>

        <ul className="mt-2 space-y-1 text-xs text-gray-500 list-disc list-inside">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        {/* --- Manual scratch-code fallback --- */}
        <button
          type="button"
          onClick={() => setOpenManual((v) => !v)}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium border transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: "white",
            color: "var(--color-accent)",
            borderColor: "var(--color-accent)",
            borderWidth: 1,
          }}
        >
          {openManual ? "Hide manual code" : "No QR? Enter code instead"}
        </button>

        {openManual && (
          <div className="mt-2 rounded-2xl border bg-white p-4">
            <h3 className="text-lg font-semibold mb-2">Enter your scratch code</h3>
            <p className="text-sm text-gray-600 mb-2">
              Type the code exactly as shown (ignore spaces and dashes — we’ll clean it up).
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="latin"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                value={manualCode}
                onChange={handleManualChange}
                placeholder="e.g. PM1234ABCD5678"
                className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm"
              />
              <button
                type="button"
                onClick={handleManualPrepare}
                className="rounded-lg px-3 py-2 text-sm font-medium border"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-accent), var(--color-accent-2))",
                  color: "white",
                  borderColor: "transparent",
                }}
              >
                Prepare
              </button>
            </div>

            {manualError && <p className="text-red-600 text-sm mt-2">{manualError}</p>}

            {manualReady && (
              <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
                <p className="text-gray-700">
                  We’ve cleaned your code. Copy it, then continue on the official Pop Mart page:
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="px-2 py-1 rounded bg-white border font-mono">
                    {sanitize(manualCode)}
                  </code>
                  <button type="button" onClick={handleCopy} className="rounded px-2 py-1 border text-xs">
                    Copy
                  </button>
                </div>
                <button
                  type="button"
                  onClick={openOfficialHelp}
                  className="mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium border"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-accent), var(--color-accent-2))",
                    color: "white",
                    borderColor: "transparent",
                  }}
                >
                  Open Pop Mart authenticity page
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  We don’t submit your code to Pop Mart — they don’t offer a public API. You’ll paste the code there to complete verification.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}