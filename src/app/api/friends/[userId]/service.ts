import prisma from "@/utils/db";

export async function getFriends(userId: string) {
  const user = await prisma.appUser.findUnique({
    where: {
      id: userId,
    },
    select: {
      friends: {
        select: {
          id: true,
          username: true,
          email: true,
          profile: {
            select: {
              fullname: true,
              imageProfile: true,
            },
          },
        },
      },
    },
  });

  return user?.friends || [];
}
