import { createFriendRequest, getFriendRequest } from "./service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UserRequestHeader } from "@/interface";
import { responseFormatter } from "@/utils/response-formatter";

export async function POST(req: Request) {
  try {
    const { requesterId, requestedId } = await req.json();
    const data = await createFriendRequest(requesterId, requestedId);
    if (data) {
      return responseFormatter(
        true,
        "Permintaan pertemanan berhasil dilakukan",
        201
      );
    }
    return responseFormatter(
      false,
      "Permintaan pertemanan gagal dilakukan",
      500
    );
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return responseFormatter(
        false,
        "Permintaan pertemanan telah dilakukan",
        409
      );
    }
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    let users: UserRequestHeader[] = [];
    if (userId) {
      users = await getFriendRequest(userId);
      if (users.length == 0) {
        return responseFormatter(true, "Permintaan pertemanan kosong", 200, []);
      }
      return responseFormatter(true, "Berhasil mengambil data", 200, users);
    } else {
      return responseFormatter(false, "User Id is required", 400);
    }
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
