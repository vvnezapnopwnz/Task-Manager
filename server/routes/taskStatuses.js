import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app.get('/taskstatuses', { name: 'taskstatuses#index' }, async (req, reply) => {
    const taskStatuses = await app.objection.models.task_status.query();
    reply.render('taskstatuses/index', { taskStatuses });
    return reply;
  });
};
