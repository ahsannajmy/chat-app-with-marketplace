import { ProductParams } from "@/interface";
import { responseFormatter } from "@/utils/response-formatter";
import { getItemBasedProduct } from "../../service";

export async function GET(req: Request, { params }: { params: ProductParams }) {
  try {
    const { productId } = await params;
    const items = await getItemBasedProduct(productId);
    return responseFormatter(true, "Berhasil mendapatkan item", 200, items);
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
