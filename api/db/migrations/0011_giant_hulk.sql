CREATE TABLE "content_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"path" varchar(255) NOT NULL,
	"visitor_hash" varchar(64) NOT NULL,
	"is_authed" boolean DEFAULT false NOT NULL,
	"viewed_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "content_views_path_idx" ON "content_views" USING btree ("path");--> statement-breakpoint
CREATE INDEX "content_views_viewed_at_idx" ON "content_views" USING btree ("viewed_at");