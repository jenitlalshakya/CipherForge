import { CryptoUnavailableError, getWebCrypto, randomBytes } from "@/lib/crypto/random";

function fallbackUuidV4(): string {
  const bytes = randomBytes(16);

  // RFC 9562: version 4, variant 10xx.
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

export function generateUuidV4(): string {
  const webCrypto = getWebCrypto();

  if (typeof webCrypto.randomUUID === "function") {
    return webCrypto.randomUUID();
  }

  if (typeof webCrypto.getRandomValues !== "function") {
    throw new CryptoUnavailableError(
      "UUID generation requires a secure browser random source.",
    );
  }

  return fallbackUuidV4();
}

export function generateUuidV4Batch(count: number): string[] {
  if (!Number.isInteger(count) || count < 1 || count > 10) {
    throw new RangeError("Generate between 1 and 10 UUIDs at a time.");
  }

  return Array.from({ length: count }, () => generateUuidV4());
}

export const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
