import fp from 'fastify-plugin'
import fastifyPostgres from '@fastify/postgres';

export default fp(async function (fastify, opts) {
  // Access environment variables set by fastify-env
  const databaseUrl = fastify.config.DATABASE_URL;

  // Register the Postgres plugin with the DATABASE_URL
  fastify.register(fastifyPostgres, {
    connectionString: databaseUrl
  });
});