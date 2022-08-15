/*
  Warnings:

  - You are about to alter the column `token` on the `sessions` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.
  - A unique constraint covering the columns `[token]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `sessions` MODIFY `token` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `sessions_token_key` ON `sessions`(`token`);
