
import { serial, text, pgTable, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const skillLevelEnum = pgEnum('skill_level', ['Beginner', 'Beginner++', 'Intermediate', 'Advanced', 'Extra Advanced']);
export const groupAffiliationEnum = pgEnum('group_affiliation', ['Close Friends', 'Outsiders']);
export const matchStatusEnum = pgEnum('match_status', ['active', 'completed', 'cancelled']);
export const gameRequestStatusEnum = pgEnum('game_request_status', ['pending', 'active', 'completed', 'cancelled']);

// Players table
export const playersTable = pgTable('players', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  skill_level: skillLevelEnum('skill_level').notNull(),
  group_affiliation: groupAffiliationEnum('group_affiliation').notNull(),
  is_present: boolean('is_present').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Courts table
export const courtsTable = pgTable('courts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Matches table
export const matchesTable = pgTable('matches', {
  id: serial('id').primaryKey(),
  court_id: integer('court_id').references(() => courtsTable.id).notNull(),
  player1_id: integer('player1_id').references(() => playersTable.id).notNull(),
  player2_id: integer('player2_id').references(() => playersTable.id).notNull(),
  player3_id: integer('player3_id').references(() => playersTable.id).notNull(),
  player4_id: integer('player4_id').references(() => playersTable.id).notNull(),
  team1_score: integer('team1_score').notNull().default(0),
  team2_score: integer('team2_score').notNull().default(0),
  status: matchStatusEnum('status').notNull().default('active'),
  started_at: timestamp('started_at'),
  ended_at: timestamp('ended_at'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Game requests table (for pre-requested groups)
export const gameRequestsTable = pgTable('game_requests', {
  id: serial('id').primaryKey(),
  player1_id: integer('player1_id').references(() => playersTable.id).notNull(),
  player2_id: integer('player2_id').references(() => playersTable.id).notNull(),
  player3_id: integer('player3_id').references(() => playersTable.id).notNull(),
  player4_id: integer('player4_id').references(() => playersTable.id).notNull(),
  status: gameRequestStatusEnum('status').notNull().default('pending'),
  priority: integer('priority').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Queue table
export const queueTable = pgTable('queue', {
  id: serial('id').primaryKey(),
  player_id: integer('player_id').references(() => playersTable.id).notNull(),
  joined_at: timestamp('joined_at').defaultNow().notNull(),
  priority: integer('priority').notNull().default(0)
});

// Relations
export const playersRelations = relations(playersTable, ({ many }) => ({
  matches_as_player1: many(matchesTable, { relationName: 'player1' }),
  matches_as_player2: many(matchesTable, { relationName: 'player2' }),
  matches_as_player3: many(matchesTable, { relationName: 'player3' }),
  matches_as_player4: many(matchesTable, { relationName: 'player4' }),
  game_requests_as_player1: many(gameRequestsTable, { relationName: 'game_request_player1' }),
  game_requests_as_player2: many(gameRequestsTable, { relationName: 'game_request_player2' }),
  game_requests_as_player3: many(gameRequestsTable, { relationName: 'game_request_player3' }),
  game_requests_as_player4: many(gameRequestsTable, { relationName: 'game_request_player4' }),
  queue_entries: many(queueTable)
}));

export const courtsRelations = relations(courtsTable, ({ many }) => ({
  matches: many(matchesTable)
}));

export const matchesRelations = relations(matchesTable, ({ one }) => ({
  court: one(courtsTable, {
    fields: [matchesTable.court_id],
    references: [courtsTable.id]
  }),
  player1: one(playersTable, {
    fields: [matchesTable.player1_id],
    references: [playersTable.id],
    relationName: 'player1'
  }),
  player2: one(playersTable, {
    fields: [matchesTable.player2_id],
    references: [playersTable.id],
    relationName: 'player2'
  }),
  player3: one(playersTable, {
    fields: [matchesTable.player3_id],
    references: [playersTable.id],
    relationName: 'player3'
  }),
  player4: one(playersTable, {
    fields: [matchesTable.player4_id],  
    references: [playersTable.id],
    relationName: 'player4'
  })
}));

export const gameRequestsRelations = relations(gameRequestsTable, ({ one }) => ({
  player1: one(playersTable, {
    fields: [gameRequestsTable.player1_id],
    references: [playersTable.id],
    relationName: 'game_request_player1'
  }),
  player2: one(playersTable, {
    fields: [gameRequestsTable.player2_id],
    references: [playersTable.id],
    relationName: 'game_request_player2'
  }),
  player3: one(playersTable, {
    fields: [gameRequestsTable.player3_id],
    references: [playersTable.id],
    relationName: 'game_request_player3'
  }),
  player4: one(playersTable, {
    fields: [gameRequestsTable.player4_id],
    references: [playersTable.id],
    relationName: 'game_request_player4'
  })
}));

export const queueRelations = relations(queueTable, ({ one }) => ({
  player: one(playersTable, {
    fields: [queueTable.player_id],
    references: [playersTable.id]
  })
}));

// Export all tables for relation queries
export const tables = {
  players: playersTable,
  courts: courtsTable,
  matches: matchesTable,
  game_requests: gameRequestsTable,
  queue: queueTable
};
