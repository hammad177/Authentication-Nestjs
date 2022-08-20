/*
  Warnings:

  - You are about to drop the column `discription` on the `recipe` table. All the data in the column will be lost.
  - Added the required column `description` to the `recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `recipe` DROP COLUMN `discription`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;
