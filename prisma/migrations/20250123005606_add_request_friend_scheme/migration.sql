-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "RequestFriend" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requesterId" TEXT NOT NULL,
    "requestedId" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "RequestFriend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestFriend" ADD CONSTRAINT "RequestFriend_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "AppUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestFriend" ADD CONSTRAINT "RequestFriend_requestedId_fkey" FOREIGN KEY ("requestedId") REFERENCES "AppUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
