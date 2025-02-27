import { getUser, createSession } from "../service";
import bcrypt from "bcryptjs";
import { responseFormatter } from "@/utils/response-formatter";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    if (data.username && data.password) {
      const user = await getUser(data.username);
      if (user && bcrypt.compareSync(data.password, user.password)) {
        await createSession(user.id);
        return responseFormatter(true, "Login berhasil", 200);
      } else {
        return responseFormatter(false, "Login gagal kredensial salah", 401);
      }
    }
    return responseFormatter(false, "Tolong input data dengan lengkap", 400);
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
