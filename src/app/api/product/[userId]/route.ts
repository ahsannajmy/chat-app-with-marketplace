import { UserParams } from "@/interface";
import { responseFormatter } from "@/utils/response-formatter";
import { createProduct, getProduct } from "../service";

export async function POST(req: Request, { params }: { params: UserParams }) {
  try {
    const { userId } = await params;
    const data = await req.json();
    const product = await createProduct(userId, data.name);
    return responseFormatter(true, "Berhasil menambahkan produk", 201, product);
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500,
      null
    );
  }
}

export async function GET(req: Request, { params }: { params: UserParams }) {
  try {
    const { userId } = await params;
    const products = await getProduct(userId);
    return responseFormatter(
      true,
      "Berhasil mendapatkan produk",
      200,
      products
    );
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
