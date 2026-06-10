CREATE TABLE "game_players" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now(),
	"architecture" jsonb,
	"score" double precision DEFAULT 0,
	"score_breakdown" jsonb,
	"last_submitted_at" timestamp with time zone,
	CONSTRAINT "game_players_session_user_unique" UNIQUE("session_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "game_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" varchar(120),
	"status" varchar(20) DEFAULT 'lobby' NOT NULL,
	"seed" integer DEFAULT 1 NOT NULL,
	"starts_at" timestamp with time zone,
	"starting_architecture" jsonb,
	"locked_node_ids" jsonb,
	"allow_delete_starting" boolean DEFAULT true,
	"load_profile" jsonb,
	"chaos_events" jsonb,
	"scoring_config" jsonb,
	"budget" jsonb,
	"duration_sec" integer,
	"started_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"created_by" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "game_sessions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "game_players" ADD CONSTRAINT "game_players_session_id_game_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."game_sessions"("id") ON DELETE cascade ON UPDATE no action;