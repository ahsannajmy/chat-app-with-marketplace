import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { responseFormatter } from "@/utils/response-formatter";
import { register } from "../service";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await register(data);
    return responseFormatter(
      true,
      "Sukses mendaftarkan akun, silahkan login",
      201
    );
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const metaTarget = error.meta?.target;
      if (metaTarget && Array.isArray(metaTarget)) {
        return responseFormatter(
          false,
          `User dengan ${metaTarget[0]} tersebut sudah ada`,
          409
        );
      }
    }
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
