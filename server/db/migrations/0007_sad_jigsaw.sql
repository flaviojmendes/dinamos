ALTER TABLE "content_annotations" ALTER COLUMN "body" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "content_annotations" ADD COLUMN "kind" varchar(20) DEFAULT 'text' NOT NULL;--> statement-breakpoint
ALTER TABLE "content_annotations" ADD COLUMN "drawing" jsonb;--> statement-breakpoint
ALTER TABLE "content_annotations" ADD COLUMN "anchor" jsonb;