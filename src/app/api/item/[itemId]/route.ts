import { ItemParams } from "@/interface";
import { responseFormatter } from "@/utils/response-formatter";
import { getItem } from "../service";

export async function GET(req: Request, { params }: { params: ItemParams }) {
  try {
    const { itemId } = await params;
    const item = await getItem(itemId);
    return responseFormatter(true, "Berhasil mendapatkan item", 200, item);
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
