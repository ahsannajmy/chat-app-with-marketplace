import { rejectRequest } from "./service";
import { responseFormatter } from "@/utils/response-formatter";

export async function PUT(req: Request) {
  try {
    const { friendId, userId } = await req.json();
    await rejectRequest(friendId, userId);
    return responseFormatter(true, "Pertemanan ditolak", 201);
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
