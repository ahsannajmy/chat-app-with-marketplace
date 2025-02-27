export interface AppUser {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface UserHeader {
  id: string;
  username: string;
  email: string;
  profile: {
    fullname: string;
    imageProfile: string | null | undefined;
  };
}

export interface UserRequestHeader {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface UserParams {
  userId: string;
}

export interface ProductParams {
  productId: string;
}

export interface ItemParams {
  itemId: string;
}

export interface UserProfileHeader {
  id: string;
  createdAt: Date;
  email: string;
  username: string;
  profile: {
    fullname?: string;
    bio?: string;
    imageProfile?: string;
    dob?: Date;
  };
}

export interface ProductHeader {
  id: string;
  name: string;
}

export interface ImageItemHeader {
  id: string;
  imageUrl: string;
  name: string;
  description: string;
}

export interface ItemHeader {
  id: string;
  name: string;
  description: string;
  info: string;
  price: number;
  stock: number;
  thumbnail: string;
  productId: string;
  imageItems: ImageItemHeader[];
}

export interface CreateProductPayload {
  name: string;
}

export interface CreateItemPayload {
  name: string;
  productId: string;
  description: string;
  info: string;
  price: number;
  stock: number;
}

export interface CreateItemImagePayload {
  imageUrl: string;
  itemId: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  fullname: string;
  email: string;
}
