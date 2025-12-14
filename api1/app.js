import path from 'node:path'
import AutoLoad from '@fastify/autoload'
import { fileURLToPath } from 'node:url'
import fastifyEnv from '@fastify/env'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Schema for environment variables
const schema = {
  type: 'object',
  required: ['PORT', 'API_SECRET', 'DB_URL'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000
    },
    API_SECRET: {
      type: 'string'
    },
    DB_URL: {
      type: 'string'
    }
  }
};

// Pass --options via CLI arguments in command to enable these options.
export const opts = {
  schema: schema,
  dotenv: true, // This enables reading from .env file
  // confKey: 'config', // Default key to access variables, e.g., fastify.config.PORT
}

export default async function (fastify, options) {
  // Place here your custom code!
  console.log(options)
  await fastify.register(fastifyEnv, opts)
  

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
