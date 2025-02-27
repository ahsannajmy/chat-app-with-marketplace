import { MessageCircleMore } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/session-context";

interface FriendCardProps {
  id: string;
  alias: string;
  username: string;
  imageProfile: string;
  isSelected?: boolean;
  updateCurrentMessage?: (friendId: string) => void;
}

const FriendCard: React.FC<FriendCardProps> = (props) => {
  const { user } = useSession();
  const router = useRouter();
  return (
    <Card className={`p-4 ${props.isSelected ? "drop-shadow-xl" : ""}`}>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <Avatar
            onClick={() => {
              if (user && user.id !== props.id) {
                router.push(`/users/${props.id}`);
              } else {
                router.push("/profile");
              }
            }}
          >
            <AvatarImage className="object-cover" src={props.imageProfile} />
            <AvatarFallback>{props.alias}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{props.username}</span>
        </div>
        {props.updateCurrentMessage && (
          <div className="flex flex-row items-center gap-2">
            <Button onClick={() => props.updateCurrentMessage?.(props.id)}>
              <MessageCircleMore />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FriendCard;
