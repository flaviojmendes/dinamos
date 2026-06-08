CREATE TABLE "content_annotations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"path" varchar(255),
	"body" text NOT NULL,
	"color" varchar(20),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "content_annotations_user_slug_idx" ON "content_annotations" USING btree ("user_id","slug");