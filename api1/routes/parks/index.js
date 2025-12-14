
const parksRoutes = async (fastify, options) => {
    const { Parks } = fastify.sequelize.models;
    fastify.get('/', async (request, reply) => {
        console.log(fastify.sequelize)
        const parks = {} // await Parks.findAll();
        return parks;
    });
};

export default parksRoutes;