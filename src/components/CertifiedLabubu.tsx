// 'use client'; // ← uncomment if using Next.js App Router

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5Qrcode } from "html5-qrcode";
import { Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';

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
      reason: `"${url.hostname}" is not an official Pop Mart domain.`,
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
        // Ignore frequent "NotFoundException" noise
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
  type ValidateResult = { ok: true; code: string } | { ok: false; msg: string };
  
  const validateManual = (raw: string): ValidateResult => {
    const code = sanitize(raw);
    if (!/^[A-Z0-9]+$/.test(code)) return { ok: false, msg: "Use letters and numbers only." };
    if (code.length < 8) return { ok: false, msg: "Code looks too short." };
    if (code.length > 40) return { ok: false, msg: "Code looks too long." };
    return { ok: true, code };
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualCode(value);
    setManualReady(false);
    const v = validateManual(value);
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
      await navigator.clipboard.writeText(v.code);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const openOfficialHelp = () => {
    window.open("https://www.popmart.com/en/authenticity", "_blank", "noopener,noreferrer");
  };

  const tips = useMemo(
    () => [
      "Tip: Use the rear camera for faster focus.",
      "We only open Pop Mart's official verification domains.",
    ],
    []
  );

  return (
    <Card
      className={`border-primary ${className || ""}`}
      style={{
        background: "linear-gradient(135deg, rgba(255, 223, 186, 0.1), rgba(255, 192, 203, 0.1))"
      }}
    >
      <Card.Body className="p-4">
        <Card.Title 
          as="h2"
          className="display-6 fw-bold mb-4"
          style={{
            background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          Labubu Certificate
        </Card.Title>

        <div className="d-flex flex-column gap-4">
          {/* --- Inline Scanner Toggle (camera) --- */}
        <div className="d-grid gap-2 d-sm-flex">
          <Button
            variant="primary"
            onClick={() => setOpenScanner((v) => !v)}
            className="flex-fill"
            style={{
              background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info))",
              border: "none"
            }}
          >
            {openScanner ? "Hide Camera Scanner" : "Scan with Camera"}
          </Button>

          {/* --- File upload trigger --- */}
          <Button
            variant="outline-primary"
            onClick={onPickImage}
            className="flex-fill"
          >
            Scan from Image
          </Button>
          <Form.Control
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="d-none"
            onChange={onFileSelected}
          />
        </div>

        {/* Camera scanner panel */}
        {openScanner && (
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="h5 mb-3">
                Scan Pop Mart authenticity QR (Camera)
              </Card.Title>
              <div id={cameraContainerId} className="border rounded overflow-hidden" />
            </Card.Body>
          </Card>
        )}

        {/* File preview panel (optional, shown once a file is chosen) */}
        {filePreviewUrl && (
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="h5 mb-3">
                Image Preview
              </Card.Title>
              <div className="border rounded overflow-hidden">
                {/* Html5Qrcode shows the scanned image into this element when scanFile(..., true) */}
                <div id={filePreviewId} />
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Feedback + tips */}
        {error && (
          <Alert variant="danger">
            {error} We only open: <code>fwsy.popmart.com</code>, <code>popmart.com</code>, and{" "}
            <code>ppmt.*.popmart.com</code>.
          </Alert>
        )}
        {scanned && (
          <Alert variant="info">
            Scanned: <code>{scanned}</code>
          </Alert>
        )}

        <Card bg="light" className="border-0">
          <Card.Body className="small">
            <ul className="mb-0 ps-3">
              {tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Card.Body>
        </Card>

        {/* --- Manual scratch-code fallback --- */}
        <Button
          variant="outline-primary"
          onClick={() => setOpenManual((v) => !v)}
          className="w-100"
          style={{
            background: "white",
            borderColor: "var(--bs-primary)"
          }}
        >
          {openManual ? "Hide manual code" : "No QR? Enter code instead"}
        </Button>

        {openManual && (
          <Card>
            <Card.Body>
              <Card.Title as="h3" className="h5 mb-3">Enter your scratch code</Card.Title>
              <Card.Text className="text-muted small mb-3">
                Type the code exactly as shown (ignore spaces and dashes — we'll clean it up).
              </Card.Text>

              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  value={manualCode}
                  onChange={handleManualChange}
                  placeholder="e.g. PM1234ABCD5678"
                  className="font-monospace"
                  isInvalid={!!manualError}
                />
                <Button
                  variant="primary"
                  onClick={handleManualPrepare}
                  style={{
                    background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info))",
                    border: "none"
                  }}
                >
                  Prepare
                </Button>
                <Form.Control.Feedback type="invalid">
                  {manualError}
                </Form.Control.Feedback>
              </InputGroup>

              {manualReady && (
                <Alert variant="light" className="mb-0">
                  <p className="mb-3">
                    We've cleaned your code. Copy it, then continue on the official Pop Mart page:
                  </p>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="text"
                      readOnly
                      value={sanitize(manualCode)}
                      className="font-monospace bg-white"
                    />
                    <Button variant="outline-secondary" onClick={handleCopy}>
                      Copy
                    </Button>
                  </InputGroup>
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      onClick={openOfficialHelp}
                      style={{
                        background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info))",
                        border: "none"
                      }}
                    >
                      Open Pop Mart authenticity page
                    </Button>
                  </div>
                  <p className="text-muted small mt-2 mb-0">
                    We don't submit your code to Pop Mart — they don't offer a public API. You'll paste the code there to complete verification.
                  </p>
                </Alert>
              )}
            </Card.Body>
          </Card>
        )}
        </div>
      </Card.Body>
    </Card>
  );
}
