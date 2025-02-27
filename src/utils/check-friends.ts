import { UserHeader } from "@/interface";

export function checkFriend(
  friends: UserHeader[],
  currentProfileId: string
): boolean {
  return friends.some((friend) => friend.id === currentProfileId);
}
