-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone_activation_code" VARCHAR(10),
ADD COLUMN     "phone_activation_code_expiration" TIMESTAMP(3);
