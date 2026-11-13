import type { SecretOptions } from "@/types/crypto";

export const DEFAULT_OUTPUT_COUNT = 3;

export const DEFAULT_SECRET_OPTIONS: SecretOptions = {
  length: 24,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
  customCharacters: "",
  customOnly: false,
  count: DEFAULT_OUTPUT_COUNT,
};

export const DEFAULT_API_KEY_OPTIONS = {
  prefix: "cf_live_",
  tokenLength: 32,
  count: DEFAULT_OUTPUT_COUNT,
};

export const DEFAULT_BYTE_LENGTH = 32;
export const DEFAULT_UUID_COUNT = 3;

export const SITE_NAME = "CipherForge";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Generator", href: "#generator" },
  { label: "Security", href: "#security" },
  { label: "About", href: "#about" },
] as const;
