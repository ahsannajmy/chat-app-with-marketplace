/*
  Warnings:

  - A unique constraint covering the columns `[requesterId,requestedId]` on the table `RequestFriend` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RequestFriend_requesterId_requestedId_key" ON "RequestFriend"("requesterId", "requestedId");
