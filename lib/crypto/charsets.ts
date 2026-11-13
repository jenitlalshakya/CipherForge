import type { CharsetKey } from "@/types/crypto";

export const CHARSETS: Record<CharsetKey, string> = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
};

export const CHARSET_META: Record<
  CharsetKey,
  { label: string; hint: string; sample: string }
> = {
  uppercase: { label: "Uppercase", hint: "A–Z", sample: "A–Z" },
  lowercase: { label: "Lowercase", hint: "a–z", sample: "a–z" },
  numbers: { label: "Numbers", hint: "0–9", sample: "0–9" },
  symbols: { label: "Symbols", hint: "!@#$", sample: "!@#$" },
};

/**
 * Characters that are easy to confuse when read or transcribed.
 * Removed from every pool when "exclude ambiguous" is enabled.
 */
export const AMBIGUOUS_CHARACTERS = new Set([
  "I",
  "l",
  "1",
  "O",
  "0",
  "o",
  "|",
]);

export const BASE62_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function uniqueCharacters(value: string): string {
  return Array.from(new Set(Array.from(value))).join("");
}

export function stripWhitespace(value: string): string {
  return value.replace(/\s+/g, "");
}

export function filterAmbiguous(value: string): string {
  return Array.from(value)
    .filter((character) => !AMBIGUOUS_CHARACTERS.has(character))
    .join("");
}

export function normalizeCustomCharacters(
  value: string,
  excludeAmbiguous: boolean,
): string {
  const withoutWhitespace = stripWhitespace(value);
  const filtered = excludeAmbiguous
    ? filterAmbiguous(withoutWhitespace)
    : withoutWhitespace;

  return uniqueCharacters(filtered);
}

export function buildCharacterPools(options: {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  customCharacters: string;
  customOnly: boolean;
}): { pool: string; requiredPools: string[] } {
  const custom = normalizeCustomCharacters(
    options.customCharacters,
    options.excludeAmbiguous,
  );

  if (options.customOnly) {
    return { pool: custom, requiredPools: [] };
  }

  const requiredPools: string[] = [];

  for (const key of Object.keys(CHARSETS) as CharsetKey[]) {
    if (!options[key]) {
      continue;
    }

    const raw = CHARSETS[key];
    const filtered = options.excludeAmbiguous
      ? filterAmbiguous(raw)
      : raw;

    if (filtered.length > 0) {
      requiredPools.push(filtered);
    }
  }

  const combined = uniqueCharacters(
    [...requiredPools, custom].join(""),
  );

  return { pool: combined, requiredPools };
}
