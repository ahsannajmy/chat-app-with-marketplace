import { getUserById } from "../service";
import { UserParams } from "@/interface";
import { responseFormatter } from "@/utils/response-formatter";

export async function GET(req: Request, { params }: { params: UserParams }) {
  try {
    const { userId } = await params;
    const user = await getUserById(userId);
    return responseFormatter(true, "Data user berhasil diambil", 200, user);
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
