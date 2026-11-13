/**
 * Secure randomness primitives built exclusively on the Web Crypto API.
 *
 * No fallback to Math.random is provided anywhere in this module. If the
 * browser cannot expose a cryptographically secure random source, generation
 * fails loudly instead of producing predictable values.
 */

export class CryptoUnavailableError extends Error {
  constructor(
    message = "Secure browser cryptography is unavailable. CipherForge will not generate secrets with an insecure fallback.",
  ) {
    super(message);
    this.name = "CryptoUnavailableError";
  }
}

const UINT32_RANGE = 0x1_0000_0000;

export function getWebCrypto(): Crypto {
  const webCrypto = globalThis.crypto;

  if (
    !webCrypto ||
    typeof webCrypto.getRandomValues !== "function"
  ) {
    throw new CryptoUnavailableError();
  }

  return webCrypto;
}

export function isWebCryptoAvailable(): boolean {
  try {
    getWebCrypto();
    return true;
  } catch {
    return false;
  }
}

export function isSubtleCryptoAvailable(): boolean {
  try {
    return typeof getWebCrypto().subtle?.digest === "function";
  } catch {
    return false;
  }
}

/**
 * Returns a cryptographically secure random unsigned 32-bit integer.
 */
export function randomUint32(): number {
  const values = new Uint32Array(1);
  getWebCrypto().getRandomValues(values);
  return values[0];
}

/**
 * Returns an unbiased integer in the range [0, maxExclusive).
 *
 * Values in the final incomplete bucket of the 32-bit space are rejected,
 * which avoids the modulo bias that a naive `random % max` introduces.
 */
export function randomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new RangeError("maxExclusive must be a positive integer.");
  }

  if (maxExclusive > UINT32_RANGE) {
    throw new RangeError("maxExclusive exceeds the 32-bit random range.");
  }

  const limit = Math.floor(UINT32_RANGE / maxExclusive) * maxExclusive;
  let value = randomUint32();

  while (value >= limit) {
    value = randomUint32();
  }

  return value % maxExclusive;
}

export function randomBytes(length: number): Uint8Array {
  if (!Number.isInteger(length) || length <= 0) {
    throw new RangeError("Length must be a positive integer.");
  }

  const bytes = new Uint8Array(length);
  getWebCrypto().getRandomValues(bytes);
  return bytes;
}

export function randomItem<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new RangeError("Cannot choose from an empty collection.");
  }

  return items[randomInt(items.length)];
}

/**
 * Fisher–Yates shuffle using unbiased cryptographic sampling.
 * Returns a new array and leaves the input untouched.
 */
export function secureShuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}
