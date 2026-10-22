import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { $ZodIssue } from "zod/v4/core";

interface ProblemDetail {
  status: string;
  title: string;
  detail: string;
  instance?: string;
  [key: string]: unknown;
}

export class AppError extends HTTPException {
  constructor(
    status: ContentfulStatusCode,
    detail: Omit<ProblemDetail, "status">,
  ) {
    const headers = new Headers();
    headers.set("Content-Type", "application/problem+json");

    const res = new Response(JSON.stringify({ status, ...detail }), {
      status,
      headers,
    });

    super(status, { res });
  }
}

export function isAppError(err: unknown) {
  return err instanceof AppError;
}

export class UnauthorizedError extends AppError {
  constructor() {
    super(401, {
      title: "Unauthorized",
      detail: "Missing or invalid credentials",
    });
  }
}

export class NotFoundError extends AppError {
  constructor(path: string, detail?: string) {
    super(404, {
      title: "Not Found",
      detail: detail ? detail : `Route ${path} not found`,
      instance: path,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(detail = "You do not have permission to access this resource") {
    super(403, { title: "Forbidden", detail });
  }
}

export class ZodValidationError extends AppError {
  constructor(errors: $ZodIssue[]) {
    super(422, {
      title: "Validation Error",
      detail: "Request validation failed",
      errors: errors.map((e) => ({
        field: e.path.join("/"),
        message: e.message,
      })),
    });
  }
}

export class ValidationError extends AppError {
  constructor(errors: { field?: string; message: string }[]) {
    super(422, {
      title: "Validation Error",
      detail: "Request validation failed",
      errors,
    });
  }
}

export class InternalServerError extends AppError {
  constructor(detail = "An unexpected error occurred") {
    super(500, { title: "Internal Server Error", detail });
  }
}
