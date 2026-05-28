/*
  Warnings:

  - The primary key for the `Bid` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bidPrice` on the `Bid` table. All the data in the column will be lost.
  - The primary key for the `Hotel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `image` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `roomType` on the `Room` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Room` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `amount` to the `Bid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_hotelId_fkey";

-- AlterTable
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_pkey",
DROP COLUMN "bidPrice",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "roomId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bid_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bid_id_seq";

-- AlterTable
ALTER TABLE "Hotel" DROP CONSTRAINT "Hotel_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Hotel_id_seq";

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
DROP COLUMN "image",
DROP COLUMN "roomType",
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "hotelId" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DATA TYPE INTEGER,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Room_id_seq";

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
