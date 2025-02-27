import { responseFormatter } from "@/utils/response-formatter";
import { createItem } from "./service";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await createItem(data);
    return responseFormatter(true, "Detail item berhasil tersimpan", 201, item);
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
