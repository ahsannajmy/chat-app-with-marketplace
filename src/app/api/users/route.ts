import { getAllUser } from "./service";
import { UserHeader } from "@/interface";
import { responseFormatter } from "@/utils/response-formatter";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username") || "";
    let users: UserHeader[] = [];
    if (username) {
      users = await getAllUser(username);
    }
    if (users.length == 0) {
      return responseFormatter(true, "Data user kosong", 200, []);
    }
    return responseFormatter(true, "Data user berhasil diambil", 200, users);
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
