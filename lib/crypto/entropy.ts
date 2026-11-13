import { buildCharacterPools } from "@/lib/crypto/charsets";
import type {
  EntropyEstimate,
  SecretOptions,
  StrengthLabel,
} from "@/types/crypto";

export function getPoolSize(options: SecretOptions): number {
  return buildCharacterPools(options).pool.length;
}

export function getRequiredPoolCount(options: SecretOptions): number {
  return buildCharacterPools(options).requiredPools.length;
}

export function strengthFromBits(bits: number): {
  label: StrengthLabel;
  score: number;
} {
  const label: StrengthLabel =
    bits >= 100
      ? "Excellent"
      : bits >= 80
        ? "Very strong"
        : bits >= 60
          ? "Strong"
          : bits >= 36
            ? "Fair"
            : bits >= 28
              ? "Weak"
              : "Very weak";

  const score = Math.max(0, Math.min(100, Math.round((bits / 128) * 100)));

  return { label, score };
}

export function estimateEntropy(
  poolSize: number,
  length: number,
): EntropyEstimate {
  const bits =
    poolSize > 1 && length > 0 ? length * Math.log2(poolSize) : 0;
  const roundedBits = Math.round(bits * 10) / 10;
  const { label, score } = strengthFromBits(roundedBits);

  return {
    bits: roundedBits,
    poolSize,
    label,
    score,
  };
}

export function estimateSecretEntropy(options: SecretOptions): EntropyEstimate {
  return estimateEntropy(getPoolSize(options), options.length);
}

export function formatEntropy(bits: number): string {
  return `${bits.toFixed(1)} bits`;
}
