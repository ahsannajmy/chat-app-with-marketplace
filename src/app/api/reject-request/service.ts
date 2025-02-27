import prisma from "@/utils/db";

export async function rejectRequest(friendId: string, userId: string) {
  const status = await prisma.requestFriend.findUnique({
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

  if (status && status.status === "REJECTED") {
    throw new Error("Permintaan pertemanan sudah ditolak");
  }

  if (status) {
    await prisma.requestFriend.delete({
      where: {
        id: status.id,
      },
    });
  }
}
