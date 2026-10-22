import type { Context } from "hono";
import { InternalServerError, isAppError } from "../lib/error.ts";

export function errorHandler(err: Error, _c: Context): Response {
  if (isAppError(err)) {
    return err.getResponse();
  }

  console.error(err.message);
  return new InternalServerError().getResponse();
}
