"use client";

import { Binary } from "lucide-react";

import { ByteTokenTool } from "@/components/tools/byte-token-tool";
import { DEFAULT_BYTE_LENGTH } from "@/lib/constants";
import { generateHexSecret } from "@/lib/crypto/tokens";

export function HexTool() {
  return (
    <ByteTokenTool
      icon={Binary}
      title="Hex Generator"
      description="Generate random bytes and encode them as lowercase hexadecimal. Useful for nonces, salts, test vectors, and binary-safe identifiers."
      accent="brand-3"
      idPrefix="hex"
      outputLabel="Hex value"
      placeholder="Generate a hex value to begin."
      defaultByteLength={DEFAULT_BYTE_LENGTH}
      hint="Encoded output is twice the byte length."
      note="Source bytes come directly from crypto.getRandomValues(). Hexadecimal is an encoding, not a password hash."
      generate={generateHexSecret}
    />
  );
}
