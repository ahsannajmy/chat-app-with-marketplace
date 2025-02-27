"use client";

import { UserHeader } from "@/interface";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoaderCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ScrollArea } from "./ui/scroll-area";
import { getTime } from "@/utils/date-format";

interface ChatProps {
  user: UserHeader | null;
  friend: UserHeader | null;
}

interface MessageProperty {
  roomId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

const Chat: React.FC<ChatProps> = (props) => {
  const [isFriendTyping, setIsFriendTyping] = useState(false);
  const bottomChat = useRef<HTMLDivElement | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [messages, setMessages] = useState<MessageProperty[] | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!props.user || !props.friend) return;

    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      transports: ["websocket"],
      reconnection: false,
    });
    setSocket(socket);

    const roomId = [props.user.id, props.friend.id].sort().join("-");

    const fetchMessageHistory = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/message/${roomId}`
        );
        const data = await response.json();
        setMessages(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    socket.emit("leaveRoom");
    socket.emit("joinRoom", roomId);

    socket.on("typing", ({ senderId }) => {
      if (senderId === props.friend?.id) {
        console.log("emitted by ", senderId);
        setIsFriendTyping(true);
      }
    });

    socket.on("notTyping", ({ senderId }) => {
      if (senderId === props.friend?.id) {
        setIsFriendTyping(false);
      }
    });

    const handleReceiveMessage = async (message: MessageProperty) => {
      if ([message.senderId, message.receiverId].sort().join("-") === roomId) {
        fetchMessageHistory();
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    setLoadingMessage(true);
    fetchMessageHistory();
    setLoadingMessage(false);
    return () => {
      setMessages([]);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typing");
      socket.off("notTyping");
      socket.disconnect();
      setSocket(null);
    };
  }, [props.user, props.friend]);

  useEffect(() => {
    bottomChat.current?.scrollIntoView({ behavior: "instant" });
  });

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.user && props.friend) {
      const roomId = [props.user.id, props.friend.id].sort().join("-");
      const messageData = {
        roomId: roomId,
        senderId: props.user.id,
        receiverId: props.friend.id,
        content: newMessage,
      };

      socket?.emit("sendMessage", messageData);
      setNewMessage("");
    } else {
      return;
    }
  };

  const handleTyping = () => {
    if (props.user && props.friend && socket) {
      socket.emit("typing", {
        senderId: props.user.id,
        receiverId: props.friend.id,
      });
    }
  };

  const handleNotTyping = () => {
    if (props.user && props.friend && socket) {
      socket.emit("notTyping", {
        senderId: props.user.id,
        receiverId: props.friend.id,
      });
    }
  };

  return (
    <Card className="p-2 w-auto">
      <CardHeader>
        <CardTitle>
          Mulai Obrolan {props.friend ? `- ${props.friend.username}` : ""}
        </CardTitle>
        <CardDescription>Chat dengan temanmu</CardDescription>
      </CardHeader>
      <ScrollArea className="h-[480px]">
        <CardContent>
          <div className="flex flex-col justify-end gap-4 py-2">
            {!props.friend ? (
              ""
            ) : loadingMessage || !messages ? (
              <div className="flex justify-center">
                <LoaderCircle size={45} className="animate-spin" />
              </div>
            ) : (
              messages?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex w-full ${
                    msg.senderId === props.user?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div
                      className={`${
                        msg.senderId === props.user?.id
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      <span className="bg-foreground px-3 py-2 text-background rounded-xl">
                        {msg.content}
                      </span>
                    </div>
                    <div
                      className={`${
                        msg.senderId === props.user?.id
                          ? "text-right"
                          : "text-left"
                      } text-xs text-gray-500`}
                    >
                      {getTime(new Date(msg.timestamp))}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isFriendTyping ? (
              <div className="flex w-full justify-start">
                <span className="bg-foreground px-3 py-2 text-background rounded-xl text-xs">
                  {`${props.user?.username} is typing...`}
                </span>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div ref={bottomChat}></div>
        </CardContent>
      </ScrollArea>
      <CardContent>
        <form
          onSubmit={sendMessage}
          className="flex flex-row items-center gap-2 mt-2"
        >
          <Input
            type="text"
            placeholder="Tulis pesanmu...."
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            onFocus={handleTyping}
            onBlur={handleNotTyping}
          />
          <Button size="sm" type="submit">
            <Send />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Chat;
