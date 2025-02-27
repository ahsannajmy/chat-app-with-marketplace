import prisma from "@/utils/db";
import { extractUniqueId, utapi } from "@/utils/uploadthing";

export async function getUserById(id: string) {
  const user = await prisma.appUser.findUnique({
    where: {
      id: id,
    },
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
  });
  return user;
}

export async function getAllUser(username: string) {
  const users = await prisma.appUser.findMany({
    where: {
      username: {
        contains: username,
        mode: "insensitive",
      },
    },
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
    take: 4,
  });

  return users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    profile: {
      fullname: user.profile?.fullname || "Unknown fullname",
      imageProfile: user.profile?.imageProfile,
    },
  }));
}

export async function getUserProfile(userId: string) {
  const user = await prisma.appUser.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      createdAt: true,
      email: true,
      username: true,
      profile: {
        select: {
          fullname: true,
          bio: true,
          imageProfile: true,
          dob: true,
        },
      },
    },
  });
  return user;
}

export async function updateUserProfile(userId: string, data: FormData) {
  let fileUrl: string | null = null;
  const imageFile = data.get("imageProfile") as File;
  if (imageFile) {
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        imageProfile: true,
      },
    });
    if (userProfile?.imageProfile) {
      await utapi.deleteFiles(extractUniqueId(userProfile.imageProfile));
      const file = await utapi.uploadFiles(imageFile);
      if (file.data) {
        fileUrl = file.data.url;
      }
    } else {
      const file = await utapi.uploadFiles(imageFile);
      if (file.data) {
        fileUrl = file.data.url;
      }
    }
  }

  const fullname_data = data.get("fullname")?.toString() || null;
  const bio_data = data.get("bio")?.toString() || null;
  const dob_data = data.get("dob")?.toString() || null;

  const updateData: {
    fullname: string | null;
    bio: string | null;
    dob: string | null;
    imageProfile?: string;
  } = {
    fullname: fullname_data,
    bio: bio_data,
    dob: dob_data,
  };

  if (fileUrl) {
    updateData.imageProfile = fileUrl;
  }

  const { fullname, bio, dob, imageProfile } = await prisma.userProfile.update({
    where: {
      userId: userId,
    },
    data: updateData,
  });
  return { fullname, bio, dob, imageProfile };
}
