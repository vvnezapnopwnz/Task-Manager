// @ts-check

import i18next from 'i18next';

export default (app) => {
  app.get('/statuses', { name: 'statuses#index', preValidation: app.authenticate }, async (req, reply) => {
    const taskStatuses = await app.objection.models.taskStatus.query();
    reply.render('taskStatuses/index', { taskStatuses });
    return reply;
  });
}