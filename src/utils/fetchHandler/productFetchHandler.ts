import { CreateItemPayload, CreateProductPayload } from "@/interface";

export async function createProduct(
  userId: string,
  payload: CreateProductPayload
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${userId}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  const data = await response.json();
  return data;
}

export async function getProduct(userId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${userId}`,
    {
      method: "GET",
    }
  );
  const data = await response.json();
  return data;
}

export async function createItem(payload: CreateItemPayload) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/item`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data;
}

export async function getItemById(itemId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/item/${itemId}`
  );
  const data = await response.json();
  return data;
}

export async function getItemPerProduct(productId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/item/product/${productId}`
  );
  const data = await response.json();
  return data;
}

export async function createMultipleImages(payload: FormData) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/item/images`,
    {
      method: "POST",
      body: payload,
    }
  );
  const data = await response.json();
  return data;
}
