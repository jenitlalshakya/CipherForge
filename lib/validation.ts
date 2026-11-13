import { z } from "zod";

import { buildCharacterPools } from "@/lib/crypto/charsets";
import { MAX_HASH_INPUT_LENGTH } from "@/lib/crypto/hash";

const outputCountSchema = z
  .number()
  .int("Choose a whole number.")
  .min(1, "Generate at least one value.")
  .max(20, "Generate up to 20 values at a time.");

export const secretOptionsSchema = z
  .object({
    length: z
      .number()
      .int("Length must be a whole number.")
      .min(4, "Minimum length is 4 characters.")
      .max(128, "Maximum length is 128 characters."),
    uppercase: z.boolean(),
    lowercase: z.boolean(),
    numbers: z.boolean(),
    symbols: z.boolean(),
    excludeAmbiguous: z.boolean(),
    customCharacters: z
      .string()
      .max(128, "Custom characters are limited to 128 characters."),
    customOnly: z.boolean(),
    count: z
      .number()
      .int("Choose a whole number.")
      .min(1, "Generate at least one secret.")
      .max(20, "Generate up to 20 secrets at a time."),
  })
  .superRefine((options, context) => {
    const { pool, requiredPools } = buildCharacterPools(options);

    if (options.customOnly) {
      if (pool.length < 2) {
        context.addIssue({
          code: "custom",
          path: ["customCharacters"],
          message: "Enter at least two unique custom characters.",
        });
      }
      return;
    }

    const hasBuiltInSet =
      options.uppercase ||
      options.lowercase ||
      options.numbers ||
      options.symbols;

    if (!hasBuiltInSet) {
      context.addIssue({
        code: "custom",
        path: ["uppercase"],
        message: "Select at least one character set.",
      });
      return;
    }

    if (pool.length < 2) {
      context.addIssue({
        code: "custom",
        path: ["customCharacters"],
        message: "The selected character set must contain at least two characters.",
      });
    }

    if (requiredPools.length > options.length) {
      context.addIssue({
        code: "custom",
        path: ["length"],
        message: "Increase the length to include every selected character type.",
      });
    }
  });

export const apiKeySchema = z.object({
  prefix: z
    .string()
    .max(32, "Prefix must be 32 characters or fewer.")
    .regex(
      /^[A-Za-z0-9_-]*$/,
      "Use only letters, numbers, underscores, and hyphens.",
    ),
  tokenLength: z
    .number()
    .int("Token length must be a whole number.")
    .min(16, "Minimum token length is 16.")
    .max(64, "Maximum token length is 64."),
  count: outputCountSchema,
});

export const byteOptionsSchema = z.object({
  byteLength: z
    .number()
    .int("Byte length must be a whole number.")
    .min(8, "Minimum byte length is 8.")
    .max(64, "Maximum byte length is 64."),
  count: outputCountSchema,
});

export const hashSchema = z.object({
  text: z
    .string()
    .max(
      MAX_HASH_INPUT_LENGTH,
      `Input is limited to ${MAX_HASH_INPUT_LENGTH.toLocaleString()} characters.`,
    ),
});

export const uuidCountSchema = z.object({
  count: z
    .number()
    .int("Choose a whole number.")
    .min(1, "Generate at least one UUID.")
    .max(10, "Generate up to 10 UUIDs at a time."),
});
