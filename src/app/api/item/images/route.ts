import { responseFormatter } from "@/utils/response-formatter";
import { createMultipleImages } from "../service";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const createImageResult = await createMultipleImages(formData);
    return responseFormatter(
      true,
      "Gambar berhasil tersimpan",
      201,
      createImageResult
    );
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
