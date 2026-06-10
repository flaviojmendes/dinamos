CREATE TABLE "content_modules" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(50) NOT NULL,
	"label" varchar(200) NOT NULL,
	"tier" varchar(20) DEFAULT 'CORE' NOT NULL,
	"base" varchar(255) NOT NULL,
	"paths" jsonb,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "content_modules_key_unique" UNIQUE("key")
);
