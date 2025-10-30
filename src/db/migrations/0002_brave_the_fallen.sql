CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"payment_id" integer NOT NULL,
	"invoice_url" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
