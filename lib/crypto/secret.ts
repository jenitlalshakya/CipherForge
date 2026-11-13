import { buildCharacterPools } from "@/lib/crypto/charsets";
import { randomItem, secureShuffle } from "@/lib/crypto/random";
import type { SecretOptions } from "@/types/crypto";

export class SecretValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SecretValidationError";
  }
}

function assertValidOptions(options: SecretOptions): void {
  if (!Number.isInteger(options.length)) {
    throw new SecretValidationError("Length must be a whole number.");
  }

  if (options.length < 4 || options.length > 128) {
    throw new SecretValidationError("Length must be between 4 and 128 characters.");
  }

  if (!Number.isInteger(options.count) || options.count < 1 || options.count > 20) {
    throw new SecretValidationError("Generate between 1 and 20 secrets at a time.");
  }

  const { pool, requiredPools } = buildCharacterPools(options);

  if (pool.length < 2) {
    throw new SecretValidationError(
      options.customOnly
        ? "Add at least two unique custom characters."
        : "Select at least one character set.",
    );
  }

  if (requiredPools.length > options.length) {
    throw new SecretValidationError(
      "Increase the length to include every selected character type.",
    );
  }
}

/**
 * Generates one cryptographically secure secret.
 *
 * Every selected built-in character set is guaranteed to appear at least once,
 * then the result is securely shuffled so the guaranteed characters are not
 * predictable by position.
 */
export function generateSecret(options: SecretOptions): string {
  assertValidOptions(options);

  const { pool, requiredPools } = buildCharacterPools(options);
  const poolCharacters = Array.from(pool);
  const requiredCharacters = requiredPools.map((requiredPool) =>
    randomItem(Array.from(requiredPool)),
  );

  const characters = [...requiredCharacters];

  while (characters.length < options.length) {
    characters.push(randomItem(poolCharacters));
  }

  return secureShuffle(characters).join("");
}

export function generateSecrets(
  options: SecretOptions,
  count = options.count,
): string[] {
  assertValidOptions({ ...options, count });

  return Array.from({ length: count }, () => generateSecret(options));
}
