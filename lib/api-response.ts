import { NextResponse } from "next/server";

/* ---------- Unified API Response Type ---------- */
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
      errors?: unknown;
    };

/* ---------- Success Helper ---------- */
export function apiResponseSuccess<T>(
  data: T,
  status: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
    } satisfies ApiResponse<T>,
    { status }
  );
}

/* ---------- Error Helper ---------- */
export function apiResponseError(
  message: string,
  status: number = 400,
  errors?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    } satisfies ApiResponse<never>,
    { status }
  );
}
