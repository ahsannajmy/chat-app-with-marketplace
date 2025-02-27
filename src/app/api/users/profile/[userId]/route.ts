import { getUserProfile, updateUserProfile } from "../../service";
import { UserParams } from "@/interface";
import { responseFormatter } from "@/utils/response-formatter";

export async function GET(req: Request, { params }: { params: UserParams }) {
  try {
    const { userId } = await params;
    const userProfile = await getUserProfile(userId);
    if (userProfile) {
      return responseFormatter(
        true,
        "Data profile berhasil diambil",
        200,
        userProfile
      );
    }
    return responseFormatter(false, "Data tidak ada", 404);
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}

export async function PUT(req: Request, { params }: { params: UserParams }) {
  try {
    const { userId } = await params;
    const data = await req.formData();
    const updatedProfile = await updateUserProfile(userId, data);
    return responseFormatter(
      true,
      "Data profile berhasil diubah",
      200,
      updatedProfile
    );
  } catch (error) {
    return responseFormatter(
      false,
      error instanceof Error ? error.message : "Unknown error",
      500
    );
  }
}
