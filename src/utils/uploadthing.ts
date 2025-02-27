import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

export const extractUniqueId = (url: string) => {
  return url.substring(url.indexOf("utfs.io/f/") + 10, url.length);
};
