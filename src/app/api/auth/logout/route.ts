import { deleteSession } from "../service";
import { responseFormatter } from "@/utils/response-formatter";

export async function POST() {
  try {
    await deleteSession();
    return responseFormatter(true, "Logout berhasil", 200);
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
