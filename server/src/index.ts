
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createPlayerInputSchema, 
  updatePlayerInputSchema,
  createMatchInputSchema,
  updateMatchScoreInputSchema,
  endMatchInputSchema,
  createGameRequestInputSchema,
  joinQueueInputSchema
} from './schema';

// Import handlers
import { createPlayer } from './handlers/create_player';
import { getPlayers } from './handlers/get_players';
import { updatePlayer } from './handlers/update_player';
import { getCourts } from './handlers/get_courts';
import { createMatch } from './handlers/create_match';
import { updateMatchScore } from './handlers/update_match_score';
import { endMatch } from './handlers/end_match';
import { createGameRequest } from './handlers/create_game_request';
import { getGameRequests } from './handlers/get_game_requests';
import { joinQueue } from './handlers/join_queue';
import { leaveQueue } from './handlers/leave_queue';
import { getQueue } from './handlers/get_queue';
import { getDashboardData } from './handlers/get_dashboard_data';
import { getActiveMatches } from './handlers/get_active_matches';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Player management
  createPlayer: publicProcedure
    .input(createPlayerInputSchema)
    .mutation(({ input }) => createPlayer(input)),
  
  getPlayers: publicProcedure
    .query(() => getPlayers()),
  
  updatePlayer: publicProcedure
    .input(updatePlayerInputSchema)
    .mutation(({ input }) => updatePlayer(input)),

  // Court management
  getCourts: publicProcedure
    .query(() => getCourts()),

  // Match management
  createMatch: publicProcedure
    .input(createMatchInputSchema)
    .mutation(({ input }) => createMatch(input)),
  
  updateMatchScore: publicProcedure
    .input(updateMatchScoreInputSchema)
    .mutation(({ input }) => updateMatchScore(input)),
  
  endMatch: publicProcedure
    .input(endMatchInputSchema)
    .mutation(({ input }) => endMatch(input)),
  
  getActiveMatches: publicProcedure
    .query(() => getActiveMatches()),

  // Game request management
  createGameRequest: publicProcedure
    .input(createGameRequestInputSchema)
    .mutation(({ input }) => createGameRequest(input)),
  
  getGameRequests: publicProcedure
    .query(() => getGameRequests()),

  // Queue management
  joinQueue: publicProcedure
    .input(joinQueueInputSchema)
    .mutation(({ input }) => joinQueue(input)),
  
  leaveQueue: publicProcedure
    .input(z.object({ playerId: z.number() }))
    .mutation(({ input }) => leaveQueue(input.playerId)),
  
  getQueue: publicProcedure
    .query(() => getQueue()),

  // Dashboard
  getDashboardData: publicProcedure
    .query(() => getDashboardData()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
