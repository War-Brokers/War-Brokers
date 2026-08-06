CREATE SCHEMA IF NOT EXISTS public;--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint

CREATE TABLE "players" (
	"uid" text PRIMARY KEY NOT NULL,
	"nick" text NOT NULL,
	"nicklower" text NOT NULL,
	"level" integer NOT NULL,
	"xp" bigint NOT NULL,
	"squad" text,
	"killsELO" double precision NOT NULL,
	"gamesELO" double precision NOT NULL,
	"coins" bigint,
	"number_of_jumps" integer,
	"steam" boolean
);
--> statement-breakpoint
CREATE INDEX "nicklower_idx" ON "players" USING gin ("nicklower" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "level_idx" ON "players" USING btree ("level");--> statement-breakpoint
CREATE INDEX "xp_idx" ON "players" USING btree ("xp");--> statement-breakpoint
CREATE INDEX "squad_idx" ON "players" USING hash ("squad");--> statement-breakpoint
CREATE INDEX "killsELO_idx" ON "players" USING btree ("killsELO");--> statement-breakpoint
CREATE INDEX "gamesELO_idx" ON "players" USING btree ("gamesELO");
