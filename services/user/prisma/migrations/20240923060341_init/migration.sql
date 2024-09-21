-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('female', 'male');

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "middle_name" VARCHAR(50),
    "password_hash" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(30),
    "gender" "Gender",
    "date_of_birth" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "verify_email_secret" VARCHAR(255),
    "email_secret_expiration" TIMESTAMP(3),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
