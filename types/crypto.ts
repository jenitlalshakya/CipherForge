export const CHARSET_KEYS = [
  "uppercase",
  "lowercase",
  "numbers",
  "symbols",
] as const;

export type CharsetKey = (typeof CHARSET_KEYS)[number];

export interface SecretOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  customCharacters: string;
  customOnly: boolean;
  count: number;
}

export type StrengthLabel =
  | "Very weak"
  | "Weak"
  | "Fair"
  | "Strong"
  | "Very strong"
  | "Excellent";

export interface EntropyEstimate {
  bits: number;
  poolSize: number;
  label: StrengthLabel;
  /** A clamped 0–100 value for visual meters. */
  score: number;
}

export interface GeneratedSecret {
  id: string;
  value: string;
}

export interface ApiKeyOptions {
  prefix: string;
  tokenLength: number;
}

export interface ByteOptions {
  byteLength: number;
}

export interface HashResult {
  digest: string;
  inputBytes: number;
}
