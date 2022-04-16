// @ts-check

export default (app) => {
  app
    .get('/', { name: 'root#index' }, (req, reply) => {
      reply.render('welcome/index');
    })
    .get('/protected', { name: 'protected', preValidation: app.authenticate }, (req, reply) => {
      reply.render('welcome/index');
    });
};
