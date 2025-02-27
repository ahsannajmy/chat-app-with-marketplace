import prisma from "@/utils/db";

export async function createProduct(userId: string, name: string) {
  const product = await prisma.product.create({
    data: {
      name: name,
      userId: userId,
    },
    select: {
      name: true,
      id: true,
    },
  });
  return product;
}

export async function getProduct(userId: string) {
  const product = await prisma.product.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      name: true,
    },
  });
  return product;
}
