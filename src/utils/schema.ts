import { model, Schema } from "mongoose";

const messageSchema = new Schema({
  roomId: String,
  senderId: String,
  receiverId: String,
  content: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = model("message", messageSchema);

export default Message;
