/*
  Warnings:

  - You are about to drop the column `imageItem` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ImageItem" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "imageItem",
ADD COLUMN     "thumbnail" TEXT;
