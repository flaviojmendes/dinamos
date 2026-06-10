CREATE TABLE "content_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"path" varchar(255) NOT NULL,
	"completed" boolean DEFAULT true NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "content_progress_user_path_unique" UNIQUE("user_id","path")
);
--> statement-breakpoint
CREATE INDEX "content_progress_user_idx" ON "content_progress" USING btree ("user_id");