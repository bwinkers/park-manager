const statusDbRoute = async (fastify) => {
    fastify.get('/', async (request, reply) => {
        try {
            await fastify.sequelize.authenticate();
            return { status: 'ok', message: 'Database connection successful' };
        } catch (error) {
            reply.code(500);
            return { status: 'error', message: 'Database connection failed', error: error.message };
        }
    });
};

export default statusDbRoute;