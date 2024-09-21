/*
  Warnings:

  - You are about to drop the column `verify_email_secret` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "verify_email_secret",
ADD COLUMN     "email_activation_token" VARCHAR(255),
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "is_active" SET DEFAULT true;
