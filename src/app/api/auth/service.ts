"use server";
import prisma from "@/utils/db";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { AppUser, RegisterPayload } from "@/interface";
import bcrypt from "bcryptjs";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

interface SessionPayload extends JWTPayload {
  userId: string;
  expiresAt: Date;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

async function decrypt(
  session: string | undefined = ""
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const session = (await cookies()).get("session")?.value;
  if (!session) {
    return null;
  }
  const payload = decrypt(session);

  return payload;
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: false,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getUser(username: string): Promise<AppUser | null> {
  const user = await prisma.$queryRaw<AppUser[]>`
    SELECT DISTINCT * FROM "AppUser" au
    WHERE username = ${username}
  `;
  return user[0];
}

export async function register(data: RegisterPayload) {
  await prisma.$transaction(async (tx) => {
    const result = await tx.appUser.create({
      data: {
        username: data.username,
        email: data.email,
        password: bcrypt.hashSync(data.password, 10),
      },
    });
    if (result && data.fullname) {
      await tx.userProfile.create({
        data: {
          userId: result.id,
          fullname: data.fullname,
        },
      });
    } else {
      throw new Error("Gagal mendaftarkan akun");
    }
  });
}
