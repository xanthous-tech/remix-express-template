ALTER TABLE "user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "uniqueOnEmail" UNIQUE("email");