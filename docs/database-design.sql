CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "first_name" varchar(50) NOT NULL,
  "last_name" varchar(50) NOT NULL,
  "middle_name" varchar(50),
  "password_hash" varchar(255),
  "email" varchar(255) UNIQUE NOT NULL,
  "phone" varchar(30) UNIQUE,
  "gender" varchar(10),
  "date_of_birth" date,
  "is_active" boolean NOT NULL DEFAULT false,
  "verify_email_secret" varchar(255),
  "email_secret_expiration" timestamp,
  "created_at" timestamp NOT NULL DEFAULT (now()::date),
  "update_at" timestamp NOT NULL,
  "deleted_at" timestamp
);
