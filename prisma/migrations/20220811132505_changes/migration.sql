-- DropIndex
DROP INDEX `sessions_token_key` ON `sessions`;

-- AlterTable
ALTER TABLE `sessions` MODIFY `token` LONGTEXT NOT NULL;
