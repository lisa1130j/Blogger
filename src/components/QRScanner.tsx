// src/components/PopmartQrGate.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { Card, Container, Alert, ListGroup } from 'react-bootstrap';

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

  const handleDecode = useCallback((detectedCodes: IDetectedBarcode[]) => {
    if (!detectedCodes.length) return;
    const value = detectedCodes[0].rawValue;
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
    <Container className="py-4" style={{ maxWidth: '500px' }}>
      <Card>
        <Card.Body>
          <Card.Title as="h2" className="mb-3">Scan Pop Mart authenticity QR</Card.Title>

          <div className="border rounded overflow-hidden position-relative">
            <Scanner
              onScan={handleDecode}
              onError={(e: unknown) => setError(e instanceof Error ? e.message : "Camera error")}
              constraints={{ facingMode: "environment" }}
            />
          </div>

          {scanState !== "idle" && (
            <div className="mt-3">
              {scanState === "valid" && <Alert variant="success">Opening Pop Mart's verification…</Alert>}
              {scanState === "invalid" && <Alert variant="danger">Blocked non-official domain.</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              {scanned && (
                <Alert variant="info" className="mt-2">
                  Scanned: <code>{scanned}</code>
                </Alert>
              )}
            </div>
          )}

          <ListGroup variant="flush" className="mt-4 small text-muted">
            {tips.map((tip) => (
              <ListGroup.Item key={tip}>{tip}</ListGroup.Item>
            ))}
          </ListGroup>

          <Card className="mt-4 bg-light">
            <Card.Body>
              <Card.Subtitle className="mb-2">Allowed verification hosts</Card.Subtitle>
              <code className="d-block small">
                {OFFICIAL_HOSTS.join(", ")}; plus subdomains starting with {REDIRECT_PREFIXES.join(", ")} of
                .popmart.com
              </code>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </Container>
  );
}
