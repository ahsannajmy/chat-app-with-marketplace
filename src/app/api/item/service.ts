import { CreateItemImagePayload, CreateItemPayload } from "@/interface";
import prisma from "@/utils/db";
import { utapi } from "@/utils/uploadthing";

export async function createItem(payload: CreateItemPayload) {
  const item = await prisma.item.create({
    data: {
      name: payload.name,
      productId: payload.productId,
      description: payload.description,
      info: payload.info,
      stock: payload.stock,
      price: payload.price,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return item;
}

export async function getItemBasedProduct(productId: string) {
  const item = await prisma.item.findMany({
    where: {
      productId: productId,
    },
    include: {
      imageItems: true,
    },
  });

  return item.map((item) => ({
    ...item,
    price: item.price.toString(),
  }));
}

export async function getItem(itemId: string) {
  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    include: {
      imageItems: true,
    },
  });

  if (!item) {
    throw new Error("Item not found");
  }
  return { ...item, price: item.price.toString() };
}

export async function createMultipleImages(formData: FormData) {
  const itemId = formData.get("itemId")?.toString();
  const thubmnail = formData.get("thumbnail")?.toString();
  if (!itemId) {
    throw new Error("itemId not found");
  }

  const imagePayload: CreateItemImagePayload[] = [];
  let thumbnailUrl: string | null = null;

  for (const key of formData.keys()) {
    if (key.startsWith("imageNo")) {
      const file = await utapi.uploadFiles(formData.get(key) as File);
      if (!file.data) {
        throw new Error("Error retriveving image url for " + key);
      }

      imagePayload.push({
        imageUrl: file.data.url,
        itemId,
      });
      if (key.substring("imageNo".length) === thubmnail) {
        thumbnailUrl = file.data.url;
      }
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    if (thumbnailUrl) {
      await tx.item.update({
        where: {
          id: itemId,
        },
        data: {
          thumbnail: thumbnailUrl,
        },
      });
    } else {
      throw new Error("Thubmnail doesnt exist");
    }

    const imagesData = await tx.imageItem.createMany({
      data: imagePayload,
    });

    return imagesData;
  });

  return result;
}
