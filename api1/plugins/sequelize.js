
import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize';

async function sequelizePlugin(fastify, opts) {
    const isProd = process.env.NODE_ENV === 'production';

    // Configure database connection
    const sequelize = isProd
        ? new Sequelize(process.env.DB_URL, {
            dialect: 'postgres',
            protocol: 'postgres',
            logging: false,
        })
        : new Sequelize({
            dialect: 'sqlite',
            storage: './dev.sqlite',
            logging: false,
        });

    try {
        await sequelize.authenticate();
        fastify.log.info('Database connection established');
    } catch (err) {
        fastify.log.error('Unable to connect to the database:', err);
        throw err;
    }

    // Decorate fastify instance
    fastify.decorate('sequelize', sequelize);

    // Close connection on shutdown
    fastify.addHook('onClose', async (instance, done) => {
        await sequelize.close();
        done();
    });
}

export default fp(sequelizePlugin, {
    name: 'sequelize-fastify',
});