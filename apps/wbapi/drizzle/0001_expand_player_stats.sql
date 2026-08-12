ALTER TABLE "players" ADD COLUMN "wins" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "losses" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "number_of_capture_points" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "scuds_launched" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "total_kills" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "kill_to_death_ratio" double precision;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "kills_per_minute" double precision;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "zombie_kills" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "zombie_deaths" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "zombie_time_alive" double precision;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "zombie_time_alive_count" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "zombie_wins" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "self_destructs" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "distance_driven" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "distance_driven_count" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "kills_per_vehicle" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "shots_fired_unzoomed" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "shots_fired_zoomed" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "shots_hit_unzoomed" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "shots_hit_zoomed" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "damage_dealt" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "damage_received" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "most_kills_between_deaths" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "most_kills_in_round" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "kills_per_weapon" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "deaths" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "headshots" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "longest_kill" jsonb;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "guest" boolean;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "banned" boolean;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "time" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "joinTime" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "ping_time" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "ping_time_count" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "frame_rate" double precision;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "frame_rate_count" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "time_alive_count" integer;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "time_alive_longest" double precision;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "time_alive" double precision;