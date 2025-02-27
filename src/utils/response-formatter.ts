import { NextResponse } from "next/server";

export function responseFormatter<T>(
  success: boolean,
  message: string,
  status: number,
  data?: T
) {
  return NextResponse.json(
    {
      success: success,
      message: message,
      data: data,
    },
    {
      status: status,
    }
  );
}
