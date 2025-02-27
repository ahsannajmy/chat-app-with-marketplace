import { UserParams } from "@/interface";
import { getFriends } from "./service";
import { responseFormatter } from "@/utils/response-formatter";

export async function GET(req: Request, { params }: { params: UserParams }) {
  try {
    const { userId } = await params;
    const friends = await getFriends(userId);
    if (friends.length === 0) {
      return responseFormatter(true, "Tidak memiliki pertemanan", 200, []);
    }
    return responseFormatter(
      true,
      "Data pertemanan berhasil diambil",
      200,
      friends
    );
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
