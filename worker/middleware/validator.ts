import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";
import type z from "zod";
import { ZodValidationError } from "../lib/error.ts";

export const validator = <
  T extends z._ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result) => {
    if (!result.success) {
      throw new ZodValidationError(result.error.issues);
    }
  });
