import fastify from 'fastify';

export default () => {
  const app = fastify({
    logger: true,
  });

  app.get('/', (req, reply) => {
    reply.send({ hi: 'hello' });
  });

  return app;
};