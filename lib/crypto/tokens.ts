import { BASE62_ALPHABET } from "@/lib/crypto/charsets";
import {
  randomBytes,
  randomInt,
} from "@/lib/crypto/random";

const PREFIX_PATTERN = /^[A-Za-z0-9_-]*$/;

export class TokenValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenValidationError";
  }
}

function assertIntegerInRange(
  value: number,
  min: number,
  max: number,
  label: string,
): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new TokenValidationError(
      `${label} must be between ${min} and ${max}.`,
    );
  }
}

export function generateApiKey(prefix: string, tokenLength: number): string {
  if (prefix.length > 32) {
    throw new TokenValidationError("Prefix must be 32 characters or fewer.");
  }

  if (!PREFIX_PATTERN.test(prefix)) {
    throw new TokenValidationError(
      "Prefix may contain only letters, numbers, underscores, and hyphens.",
    );
  }

  assertIntegerInRange(tokenLength, 16, 64, "Token length");

  const characters = Array.from(BASE62_ALPHABET);
  let token = "";

  for (let index = 0; index < tokenLength; index += 1) {
    token += characters[randomInt(characters.length)];
  }

  return `${prefix}${token}`;
}

export function generateApiKeys(
  prefix: string,
  tokenLength: number,
  count: number,
): string[] {
  assertIntegerInRange(count, 1, 20, "Output count");

  return Array.from({ length: count }, () => generateApiKey(prefix, tokenLength));
}

const HEX_TABLE = "0123456789abcdef";

export function bytesToHex(bytes: Uint8Array): string {
  let output = "";

  for (const byte of bytes) {
    output += HEX_TABLE[byte >> 4] + HEX_TABLE[byte & 0x0f];
  }

  return output;
}

const BASE64_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function bytesToBase64(bytes: Uint8Array): string {
  let output = "";

  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const second = index + 1 < bytes.length ? bytes[index + 1] : 0;
    const third = index + 2 < bytes.length ? bytes[index + 2] : 0;
    const chunk = (first << 16) | (second << 8) | third;

    output += BASE64_ALPHABET[(chunk >> 18) & 63];
    output += BASE64_ALPHABET[(chunk >> 12) & 63];
    output +=
      index + 1 < bytes.length
        ? BASE64_ALPHABET[(chunk >> 6) & 63]
        : "=";
    output +=
      index + 2 < bytes.length ? BASE64_ALPHABET[chunk & 63] : "=";
  }

  return output;
}

export function generateHexSecret(byteLength: number): string {
  assertIntegerInRange(byteLength, 8, 64, "Byte length");
  return bytesToHex(randomBytes(byteLength));
}

export function generateBase64Secret(byteLength: number): string {
  assertIntegerInRange(byteLength, 8, 64, "Byte length");
  return bytesToBase64(randomBytes(byteLength));
}

export function apiKeyEntropyBits(tokenLength: number): number {
  return tokenLength * Math.log2(BASE62_ALPHABET.length);
}
