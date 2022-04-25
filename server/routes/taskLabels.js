// @ts-check

import i18next from 'i18next';

export default (app) => {
  app.get('/labels', { name: 'labels#index', preValidation: app.authenticate }, async (req, reply) => {
    const taskLabels = await app.objection.models.taskLabel.query();
    reply.render('taskLabels/index', { taskLabels });
    return reply;
  })
    .get(
      '/labels/new',
      { name: 'labels#new', preValidation: app.authenticate },
      async (req, reply) => {
        const taskLabel = new app.objection.models.taskLabel();
        reply.render('taskLabels/new', { taskLabel });
      },
    )
    .post('/labels', { name: 'labels#create', preValidation: app.authenticate }, async (req, reply) => {
      const taskLabelName = req.body.data.name;
      try {
        await app.objection.models.taskLabel.transaction(async (trx) => {
          await app.objection.models.taskLabel.query(trx)
            .insert({ name: taskLabelName });
        });
        req.flash('success', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels#index'));
        // Here the transaction has been committed.
      } catch ({ data }) {
        // Here the transaction has been rolled back.
        const taskLabel = new app.objection.models.taskLabel();
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('taskLabels/new', { taskLabel, errors: data });
      }
    })
    .get('/labels/:id/edit', { name: 'labels#edit', preValidation: app.authenticate }, async (req, reply) => {
      const taskLabel = await
      app.objection.models.taskLabel.query().findById(req.params.id);
      reply.render('taskLabels/edit', { taskLabel });
      return reply;
    })
    .patch('/labels/:id', { name: 'labels#update', preValidation: app.authenticate }, async (req, reply) => {
      const taskLabelId = req.params.id;
      const newData = req.body.data;
      try {
        const taskLabel = await app.objection.models.taskLabel.query().findById(taskLabelId);
        taskLabel.$set(newData);
        await taskLabel.$query().patch(newData);
        req.flash('success', i18next.t('flash.labels.edit.success'));
        return reply.redirect(app.reverse('labels#index'));
      } catch ({ data: errors }) {
        const taskLabel = await app.objection.models.taskLabel.query().findById(taskLabelId);
        req.flash('error', i18next.t('flash.labels.edit.error'));
        reply.code(422).render('taskLabels/edit', { taskLabel, errors });
        return reply;
      }
    })
    .delete('/labels/:id', { name: 'labels#destroy', preValidation: app.authenticate }, async (req, reply) => {
      const taskLabelId = req.params.id;
      const tasks = await app.objection.models.task.query().where('statusId', taskLabelId).debug();
      if (tasks.length === 0) {
        await app.objection.models.taskLabel.query().deleteById(taskLabelId);
        req.flash('success', i18next.t('flash.labels.delete.success'));
        return reply.redirect(app.reverse('labels#index'));
      }
      req.flash('error', i18next.t('flash.labels.delete.error'));
      return reply.redirect(app.reverse('labels#index'));
    });
};
