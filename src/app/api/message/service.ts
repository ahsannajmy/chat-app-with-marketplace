import connectDB from "@/utils/mongo-db";
import Message from "@/utils/schema";

export async function getMessage(roomId: string) {
  try {
    await connectDB();
    const message = await Message.find({
      roomId: roomId,
    }).sort({
      timestamp: 1,
    });
    return message;
  } catch (error) {
    console.log(error);
    return null;
  }
}
