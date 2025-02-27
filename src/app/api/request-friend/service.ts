import { UserRequestHeader } from "@/interface";
import prisma from "@/utils/db";

export async function createFriendRequest(
  requesterId: string,
  requestedId: string
) {
  const data = await prisma.requestFriend.create({
    data: {
      requesterId: requesterId,
      requestedId: requestedId,
    },
  });

  return data;
}

export async function getFriendRequest(
  userId: string
): Promise<UserRequestHeader[]> {
  const data = await prisma.$queryRaw<UserRequestHeader[]>`
    SELECT au.id, au.email, au.username, rf."createdAt" from "AppUser" au 
    JOIN "RequestFriend" rf
      ON au.id = rf."requesterId" 
    WHERE rf."requestedId" = ${userId} AND rf.status = 'PENDING';
  `;
  return data;
}
