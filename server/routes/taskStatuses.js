// @ts-check

import i18next from 'i18next';

export default (app) => {
  app.get('/statuses', { name: 'statuses#index', preValidation: app.authenticate }, async (req, reply) => {
    const taskStatuses = await app.objection.models.taskStatus.query();
    reply.render('taskStatuses/index', { taskStatuses });
    return reply;
  })
    .get(
      '/statuses/new',
      { name: 'statuses#new', preValidation: app.authenticate },
      async (req, reply) => {
        const taskStatus = new app.objection.models.taskStatus.query();
        reply.render('taskStatuses/new', { taskStatus });
      },
    )
    .get('/statuses/:id/edit', { name: 'statuses#edit', preValidation: app.authenticate }, async (req, reply) => {
      const taskStatus = await
      app.objection.models.taskStatus.query().findById(req.params.id);
      reply.render('taskStatuses/edit', { taskStatus });
      return reply;
    })
    .patch('/statuses/:id', { name: 'statuses#update', preValidation: app.authenticate }, async (req, reply) => {
      const taskStatusId = req.params.id;
      const newData = req.body.data;
      const taskStatus = await app.objection.models.taskStatus.query().findById(taskStatusId);
      try {
        await taskStatus.$query().patch(newData);
        req.flash('success', i18next.t('flash.statuses.edit.success'));
        return reply.redirect(app.reverse('statuses#index'));
      } catch ({ data: errors }) {
        taskStatus.$set(newData);
        reply.code(422).render('taskStatuses/edit', { taskStatus, errors });
        return reply;
      }
    })
    .post('/statuses', { name: 'statuses#create', preValidation: app.authenticate }, async (req, reply) => {
      const taskStatus = new app.objection.models.taskStatus();
      taskStatus.$set(req.body.data);
      try {
        const validStatus = await app.objection.models.taskStatus
          .fromJson(req.body.data);
        await app.objection.models.taskStatus.query().insert(validStatus);
        req.flash('error', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses#index'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('taskStatuses/new', { taskStatus, errors: data });
      }
    })
    .delete('/statuses/:id', { name: 'statuses#destroy', preValidation: app.authenticate }, async (req, reply) => {
      const taskStatusId = req.params.id;
      await app.objection.models.taskStatus.query().deleteById(taskStatusId);
      req.flash('success', i18next.t('flash.statuses.delete.success'));
      return reply.redirect(app.reverse('statuses#index'));
    });
};
