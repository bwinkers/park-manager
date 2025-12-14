import path from 'node:path'
import AutoLoad from '@fastify/autoload'
import { fileURLToPath } from 'node:url'
import fastifyEnv from '@fastify/env';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Pass --options via CLI arguments in command to enable these options.
export const options = {}

export default async function (fastify, opts) {
  // Place here your custom code!
  // Define the schema for environment variables
  const schema = {
    type: 'object',
    required: ['PORT', 'DATABASE_URL'],
    properties: {
      PORT: {
        type: 'number',
        default: 3000
      },
      DATABASE_URL: {
        type: 'string'
      }
    }
  };

  const options = {
    schema: schema,
    dotenv: true // loads .env file if present
  };

  // Register the plugin
  await fastify.register(fastifyEnv, options);

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
