import prisma from "@/utils/db";
import { RequestStatus } from "@prisma/client";

export async function acceptRequest(friendId: string, userId: string) {
  await prisma.$transaction(async (tx) => {
    const status = await tx.requestFriend.findUnique({
      select: {
        status: true,
        id: true,
      },
      where: {
        requesterId_requestedId: {
          requesterId: friendId,
          requestedId: userId,
        },
      },
    });

    if (status && status.status === RequestStatus.ACCEPTED) {
      throw new Error("Permintaan pertemanan sudah diterima");
    }

    if (status) {
      await tx.requestFriend.delete({
        where: {
          id: status.id,
        },
      });
    }

    const requested = await tx.appUser.findUnique({
      where: {
        id: userId,
      },
    });

    const requester = await tx.appUser.findUnique({
      where: {
        id: friendId,
      },
    });

    if (!requested || !requester) {
      throw new Error("User tidak ditemukan");
    }

    await tx.appUser.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          connect: {
            id: friendId,
          },
        },
      },
    });

    await tx.appUser.update({
      where: {
        id: friendId,
      },
      data: {
        friends: {
          connect: {
            id: userId,
          },
        },
      },
    });
  });
}
