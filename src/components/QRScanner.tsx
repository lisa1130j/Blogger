// src/components/PopmartQrGate.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";

type ScanState = "idle" | "scanning" | "valid" | "invalid";

const OFFICIAL_HOSTS = [
  "fwsy.popmart.com",          // official verification host
  "www.popmart.com",           // official domain (used by help pages/app links)
];

const REDIRECT_PREFIXES = [
  "ppmt.",                     // some labels resolve here then hop to fwsy
];

function normalizeUrl(raw: string): URL | null {
  try {
    // If code is just a path or missing protocol, try to coerce
    const url = raw.startsWith("http") ? new URL(raw) : new URL(`https://${raw}`);
    return url;
  } catch {
    return null;
  }
}

function isOfficial(url: URL): boolean {
  const host = url.hostname.toLowerCase();

  // Direct official hosts
  if (OFFICIAL_HOSTS.includes(host)) return true;

  // Allow known Pop Mart redirector that forwards to fwsy
  if (REDIRECT_PREFIXES.some((p) => host.startsWith(p)) && host.endsWith(".popmart.com")) {
    return true;
  }

  return false;
}

export default function PopmartQrGate() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [scanned, setScanned] = useState<string>("");
  const [error, setError] = useState<string>("");

  const lastValueRef = useRef<string>(""); // avoid duplicate fires

  const handleDecode = useCallback((value: string) => {
    if (!value || value === lastValueRef.current) return;
    lastValueRef.current = value;
    setScanned(value);
    setError("");
    setScanState("scanning");

    const url = normalizeUrl(value);
    if (!url) {
      setScanState("invalid");
      setError("That QR doesn’t look like a valid URL.");
      return;
    }

    if (!isOfficial(url)) {
      setScanState("invalid");
      setError(
        `This QR points to “${url.hostname}”, which is not on Pop Mart’s official list. For safety, we won’t open it.`
      );
      return;
    }

    setScanState("valid");
    // Immediately hand off to Pop Mart’s page
    window.location.assign(url.toString());
  }, []);

  const tips = useMemo(
    () => [
      "Tip: Use the phone’s rear camera for faster focus.",
      "We only open Pop Mart’s official verification domains.",
    ],
    []
  );

  return (
    <div className="mx-auto max-w-md p-4 rounded-2xl shadow border bg-white">
      <h2 className="text-xl font-semibold mb-2">Scan Pop Mart authenticity QR</h2>

      <div className="rounded-xl overflow-hidden border">
        <QrScanner
          onDecode={handleDecode}
          onError={(e) => setError(e?.message || "Camera error")}
          constraints={{ facingMode: "environment" }}
          containerStyle={{ position: "relative" }}
        />
      </div>

      {scanState !== "idle" && (
        <div className="mt-3 text-sm">
          {scanState === "valid" && <p className="text-green-600">Opening Pop Mart’s verification…</p>}
          {scanState === "invalid" && (
            <p className="text-red-600 font-medium">Blocked non-official domain.</p>
          )}
          {error && <p className="text-red-600">{error}</p>}
          {scanned && (
            <p className="mt-1 break-all text-gray-600">
              Scanned: <span className="font-mono">{scanned}</span>
            </p>
          )}
        </div>
      )}

      <ul className="mt-4 space-y-1 text-xs text-gray-500 list-disc list-inside">
        {tips.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
        <p className="font-semibold mb-1">Allowed verification hosts</p>
        <code className="block">
          {OFFICIAL_HOSTS.join(", ")}; plus subdomains starting with {REDIRECT_PREFIXES.join(", ")} of
          .popmart.com
        </code>
      </div>
    </div>
  );
}
