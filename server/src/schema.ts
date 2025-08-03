
import { z } from 'zod';

// Enums
export const skillLevelSchema = z.enum(['Beginner', 'Beginner++', 'Intermediate', 'Advanced', 'Extra Advanced']);
export type SkillLevel = z.infer<typeof skillLevelSchema>;

export const groupAffiliationSchema = z.enum(['Close Friends', 'Outsiders']);
export type GroupAffiliation = z.infer<typeof groupAffiliationSchema>;

export const matchStatusSchema = z.enum(['active', 'completed', 'cancelled']);
export type MatchStatus = z.infer<typeof matchStatusSchema>;

export const gameRequestStatusSchema = z.enum(['pending', 'active', 'completed', 'cancelled']);
export type GameRequestStatus = z.infer<typeof gameRequestStatusSchema>;

// Player schema
export const playerSchema = z.object({
  id: z.number(),
  name: z.string(),
  skill_level: skillLevelSchema,
  group_affiliation: groupAffiliationSchema,
  is_present: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Player = z.infer<typeof playerSchema>;

// Court schema
export const courtSchema = z.object({
  id: z.number(),
  name: z.string(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type Court = z.infer<typeof courtSchema>;

// Match schema
export const matchSchema = z.object({
  id: z.number(),
  court_id: z.number(),
  player1_id: z.number(),
  player2_id: z.number(),
  player3_id: z.number(),
  player4_id: z.number(),
  team1_score: z.number(),
  team2_score: z.number(),
  status: matchStatusSchema,
  started_at: z.coerce.date().nullable(),
  ended_at: z.coerce.date().nullable(),
  created_at: z.coerce.date()
});

export type Match = z.infer<typeof matchSchema>;

// Game request schema (for pre-requested groups)
export const gameRequestSchema = z.object({
  id: z.number(),
  player1_id: z.number(),
  player2_id: z.number(),
  player3_id: z.number(),
  player4_id: z.number(),
  status: gameRequestStatusSchema,
  priority: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type GameRequest = z.infer<typeof gameRequestSchema>;

// Queue entry schema
export const queueEntrySchema = z.object({
  id: z.number(),
  player_id: z.number(),
  joined_at: z.coerce.date(),
  priority: z.number()
});

export type QueueEntry = z.infer<typeof queueEntrySchema>;

// Input schemas
export const createPlayerInputSchema = z.object({
  name: z.string().min(1),
  skill_level: skillLevelSchema,
  group_affiliation: groupAffiliationSchema
});

export type CreatePlayerInput = z.infer<typeof createPlayerInputSchema>;

export const updatePlayerInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  skill_level: skillLevelSchema.optional(),
  group_affiliation: groupAffiliationSchema.optional(),
  is_present: z.boolean().optional()
});

export type UpdatePlayerInput = z.infer<typeof updatePlayerInputSchema>;

export const createMatchInputSchema = z.object({
  court_id: z.number(),
  player1_id: z.number(),
  player2_id: z.number(),
  player3_id: z.number(),
  player4_id: z.number()
});

export type CreateMatchInput = z.infer<typeof createMatchInputSchema>;

export const updateMatchScoreInputSchema = z.object({
  match_id: z.number(),
  team1_score: z.number().int().nonnegative(),
  team2_score: z.number().int().nonnegative()
});

export type UpdateMatchScoreInput = z.infer<typeof updateMatchScoreInputSchema>;

export const endMatchInputSchema = z.object({
  match_id: z.number(),
  team1_score: z.number().int().nonnegative(),
  team2_score: z.number().int().nonnegative()
});

export type EndMatchInput = z.infer<typeof endMatchInputSchema>;

export const createGameRequestInputSchema = z.object({
  player1_id: z.number(),
  player2_id: z.number(),
  player3_id: z.number(),
  player4_id: z.number(),
  priority: z.number().int().nonnegative().optional()
});

export type CreateGameRequestInput = z.infer<typeof createGameRequestInputSchema>;

export const joinQueueInputSchema = z.object({
  player_id: z.number()
});

export type JoinQueueInput = z.infer<typeof joinQueueInputSchema>;

// Dashboard data schema
export const courtStatusSchema = z.object({
  court: courtSchema,
  current_match: matchSchema.nullable(),
  players: z.array(playerSchema),
  match_duration_minutes: z.number().nullable()
});

export type CourtStatus = z.infer<typeof courtStatusSchema>;

export const benchPlayerSchema = z.object({
  player: playerSchema,
  waiting_time_minutes: z.number()
});

export type BenchPlayer = z.infer<typeof benchPlayerSchema>;

export const dashboardDataSchema = z.object({
  courts: z.array(courtStatusSchema),
  bench_players: z.array(benchPlayerSchema),
  pending_game_requests: z.array(gameRequestSchema)
});

export type DashboardData = z.infer<typeof dashboardDataSchema>;
