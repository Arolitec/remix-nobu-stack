import { PrismaClient, type Prisma } from "@prisma/client";
import invariant from "tiny-invariant";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = getClient();
} else {
  if (!global.__db__) {
    global.__db__ = getClient();
  }
  prisma = global.__db__;
}

function getClient() {
  const { DATABASE_URL, PRISMA_LOG_LEVEL } = process.env;
  invariant(typeof DATABASE_URL === "string", "DATABASE_URL env var not set");

  const client = new PrismaClient({
    log: PRISMA_LOG_LEVEL?.split(',')  as Prisma.LogLevel[]
  });
  // connect eagerly
  client.$connect();

  return client;
}

export { prisma };
