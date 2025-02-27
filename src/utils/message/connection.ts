import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "../mongo-db";
import Message from "../schema";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  content: string;
}

io.on("connection", async (socket: import("socket.io").Socket) => {
  await connectDB();
  console.log("User connected : ", socket.id);

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on("leaveRoom", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((room) => {
      socket.leave(room);
    });
  });

  socket.on("typing", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    if (roomId) {
      io.to(roomId).emit("typing", {
        senderId,
        receiverId,
      });
    }
  });

  socket.on("notTyping", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    if (roomId) {
      io.to(roomId).emit("notTyping", {
        senderId,
        receiverId,
      });
    }
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, content }: SendMessagePayload) => {
      const roomId = [senderId, receiverId].sort().join("-");
      const message = new Message({
        roomId,
        senderId,
        receiverId,
        content,
      });
      await message.save();

      if (roomId) {
        io.to(roomId).emit("receiveMessage", {
          senderId,
          receiverId,
          content,
        });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

httpServer.listen(3001, () => console.log("Running Web Socket"));
