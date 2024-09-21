/*
  Warnings:

  - You are about to drop the column `email_secret_expiration` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_secret_expiration",
ADD COLUMN     "email_activation_token_expiration" TIMESTAMP(3);
