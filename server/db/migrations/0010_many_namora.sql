ALTER TABLE "game_players" ADD COLUMN "round_scores" jsonb;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD COLUMN "rounds" jsonb;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD COLUMN "phase" varchar(20) DEFAULT 'lobby' NOT NULL;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD COLUMN "current_round" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD COLUMN "round_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "game_sessions" ADD COLUMN "round_ends_at" timestamp with time zone;