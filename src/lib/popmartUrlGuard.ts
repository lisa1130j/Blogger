// Lightweight URL guard for Pop Mart authenticity scans

export type GuardResult =
  | { ok: true; url: URL; reason?: undefined }
  | { ok: false; input: string; reason: string };

const OFFICIAL_HOSTS = new Set<string>([
  "fwsy.popmart.com", // primary verification
  "www.popmart.com",  // main site
  "popmart.com",      // just in case a bare apex shows up
]);

// e.g. ppmt.*.popmart.com
const REDIRECT_PREFIXES = ["ppmt."];

/** Try to turn any QR string into a URL (adds https:// if missing) */
export function toUrl(raw: string): URL | null {
  try {
    const trimmed = raw.trim();
    // Some codes are just host/path without protocol
    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    return new URL(candidate);
  } catch {
    return null;
  }
}

/** Return true if host is allowed (official or known redirector). */
export function isOfficialHost(hostname: string): boolean {
  const host = hostname.toLowerCase();

  if (OFFICIAL_HOSTS.has(host)) return true;

  // Allow ppmt.*.popmart.com style redirectors
  if (host.endsWith(".popmart.com")) {
    for (const p of REDIRECT_PREFIXES) {
      if (host.startsWith(p)) return true;
    }
  }
  return false;
}

/** Guard the scanned value; only allow navigation to official hosts. */
export function guardScannedValue(raw: string): GuardResult {
  if (!raw || typeof raw !== "string") {
    return { ok: false, input: raw, reason: "Empty or invalid scan result." };
  }

  const url = toUrl(raw);
  if (!url) {
    return { ok: false, input: raw, reason: "Not a valid URL." };
  }

  // Optional: block known shortening domains (require user to open manually)
  const shorteners = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "shorturl.at"];
  if (shorteners.includes(url.hostname.toLowerCase())) {
    return {
      ok: false,
      input: raw,
      reason: "Shortened URL detected. For safety, only direct Pop Mart links are allowed.",
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
