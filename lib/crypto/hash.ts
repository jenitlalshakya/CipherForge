import { bytesToHex } from "@/lib/crypto/tokens";
import { CryptoUnavailableError, getWebCrypto } from "@/lib/crypto/random";
import type { HashResult } from "@/types/crypto";

export const MAX_HASH_INPUT_LENGTH = 10_000;

export async function sha256(text: string): Promise<HashResult> {
  if (text.length > MAX_HASH_INPUT_LENGTH) {
    throw new RangeError(
      `Hashing is limited to ${MAX_HASH_INPUT_LENGTH.toLocaleString()} characters.`,
    );
  }

  const webCrypto = getWebCrypto();

  if (typeof webCrypto.subtle?.digest !== "function") {
    throw new CryptoUnavailableError(
      "SHA-256 requires the Web Crypto SubtleCrypto API, which this browser does not expose.",
    );
  }

  const encoded = new TextEncoder().encode(text);
  const digest = await webCrypto.subtle.digest("SHA-256", encoded);

  return {
    digest: bytesToHex(new Uint8Array(digest)),
    inputBytes: encoded.byteLength,
  };
}
