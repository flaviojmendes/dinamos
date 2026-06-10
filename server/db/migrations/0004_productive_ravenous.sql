CREATE TABLE "content_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"path" varchar(255) NOT NULL,
	"module_id" varchar(50),
	"requires_subscription" boolean DEFAULT true NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"simulator_key" varchar(120),
	"published" boolean DEFAULT true NOT NULL,
	"title_en" varchar(500),
	"title_pt" varchar(500),
	"body_en" text,
	"body_pt" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "content_pages_slug_unique" UNIQUE("slug"),
	CONSTRAINT "content_pages_path_unique" UNIQUE("path")
);
