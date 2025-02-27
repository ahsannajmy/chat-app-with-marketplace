import { Button } from "./ui/button";

import { Card } from "./ui/card";
import { toast } from "sonner";
import {
  fetchAcceptRequestFriend,
  fetchRejectRequestFriend,
} from "@/utils/fetchHandler/requestFriendHandler";
import { useSession } from "@/context/session-context";

interface UserSectionProps {
  alias?: string;
  username?: string;
  email?: string;
  id?: string;
  sectionType?: UserSectionType;
  date?: string;
  updateRequestSection?: () => void;
}

export enum UserSectionType {
  FINDUSER,
  REQUESTEDUSER,
}

const UserSection: React.FC<UserSectionProps> = (props) => {
  const { user } = useSession();
  async function acceptRequestHandler(friendId: string | undefined) {
    if (!friendId) {
      toast.error("Id teman tidak ditemukan");
    } else {
      if (user) {
        const data = await fetchAcceptRequestFriend(friendId, user.id);
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    }
  }

  async function rejectRequestHandler(friendId: string | undefined) {
    if (!friendId) {
      toast.error("Id teman tidak ditemukan");
    } else {
      if (user) {
        const data = await fetchRejectRequestFriend(friendId, user.id);
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    }
  }
  return (
    <Card className="p-4 rounded-xl w-full">
      <div className="flex flex-col items-start gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold">{props.username}</span>
          <span className="text-xs text-gray-500">{props.date}</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Button
            type="button"
            size="sm"
            className="bg-green-500 hover:bg-green-500/90"
            onClick={() => {
              acceptRequestHandler(props.id).then(() => {
                props.updateRequestSection?.();
              });
            }}
          >
            Accept
          </Button>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => {
              rejectRequestHandler(props.id).then(() => {
                props.updateRequestSection?.();
              });
            }}
          >
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UserSection;
