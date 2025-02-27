import { responseFormatter } from "@/utils/response-formatter";
import { getMessage } from "../service";

interface MessageParams {
  roomId: string;
}

export async function GET(req: Request, { params }: { params: MessageParams }) {
  try {
    const { roomId } = await params;
    const messages = await getMessage(roomId);
    return responseFormatter(
      true,
      `Data pesan dengan roomId : ${roomId} berhasil diambil`,
      200,
      messages
    );
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
