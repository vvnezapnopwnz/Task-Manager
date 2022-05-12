// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks#index', preValidation: app.authenticate }, async (req, reply) => {
      const taskStatuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const taskLabels = await app.objection.models.taskLabel.query();
      const tasks = await app.objection.models.task.query()
        .modify('filterExecutor', req.query.executor)
        .modify('filterStatus', req.query.status)
        .modify('filterLabel', req.query.label)
        .modify('filterByOwner', req.query.creatorUser ? req.user.id : null)
        .withGraphJoined('[status, creator, executor, labels]');
      reply.render('tasks/index', {
        tasks, taskStatuses, users, taskLabels, selectedItems: req.query,
      });
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'tasks#edit', preValidation: app.authenticate }, async (req, reply) => {
      const task = await
      app.objection.models.task.query()
        .withGraphJoined('[status, creator, executor, labels]').findById(req.params.id);
      const taskStatuses = await app.objection.models.taskStatus.query();
      const taskLabels = await app.objection.models.taskLabel.query();
      const users = await app.objection.models.user.query();
      reply.render('tasks/edit', {
        task, taskStatuses, users, taskLabels,
      });
      return reply;
    })
    .get('/tasks/new', { name: 'tasks#new', preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const taskStatuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const taskLabels = await app.objection.models.taskLabel.query();
      reply.render('tasks/new', {
        task, taskStatuses, users, taskLabels,
      });
      return reply;
    })
    .post(
      '/tasks',
      { name: 'tasks#create', preValidation: app.authenticate },
      async (req, reply) => {
        const creatorId = req.user.id;
        const {
          name, description, statusId, executorId,
        } = req.body.data;
        const taskData = {
          name,
          description,
          creatorId,
          statusId: Number(statusId),
        };
        if (executorId !== '') {
          taskData.executorId = Number(executorId);
        }
        const labelsIds = _.get(req.body.data, 'labels', []);
        const thisTaskLabels = await app.objection.models.taskLabel
          .query()
          .findByIds(labelsIds);
        taskData.labels = thisTaskLabels;
        try {
          await app.objection.models.task.transaction(async (trx) => {
            await app.objection.models.task
              .query(trx)
              .insertGraph(taskData, { relate: true });
          });
          req.flash('info', i18next.t('flash.tasks.create.success'));
          return reply.redirect(app.reverse('tasks#index'));
        } catch ({ data: errors }) {
          const taskStatuses = await app.objection.models.taskStatus.query();
          const users = await app.objection.models.user.query();
          const taskLabels = await app.objection.models.taskLabel.query();
          req.flash('error', i18next.t('flash.tasks.create.error'));
          reply.render('tasks/new', {
            task: taskData, users, taskStatuses, taskLabels, errors,
          });
          return reply;
        }
      },
    )
    .patch('/tasks/:id/', { name: 'tasks#update', preValidation: app.authenticate }, async (req, reply) => {
      const taskId = req.params.id;
      const task = await app.objection.models.task.query().withGraphJoined('[status, creator, executor, labels]')
        .findById(taskId);
      const creatorId = req.user.id;
      const {
        name, description, statusId, executorId,
      } = req.body.data;
      const taskData = {
        name,
        description,
        creatorId,
        statusId: Number(statusId),
      };
      if (executorId !== '') {
        taskData.executorId = Number(executorId);
      }
      const labelsIds = _.get(req.body.data, 'labels', []);
      const thisTaskLabels = await app.objection.models.taskLabel
        .query()
        .findByIds(labelsIds);
      taskData.labels = thisTaskLabels;
      try {
        await app.objection.models.task.transaction(async (trx) => {
          await task.$relatedQuery('labels', trx).unrelate();
          await task.$query(trx).patch(taskData);
          await Promise.all(taskData.labels.map((label) => task.$relatedQuery('labels', trx).relate(label)));
        });
        req.flash('success', i18next.t('flash.tasks.edit.success'));
        return reply.redirect(app.reverse('tasks#index'));
      } catch ({ data: errors }) {
        const taskStatuses = await app.objection.models.taskStatus.query();
        const users = await app.objection.models.user.query();
        const taskLabels = await app.objection.models.taskLabel.query();
        task.$set(taskData);
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/edit', {
          task, taskStatuses, taskLabels, users, errors,
        });
        return reply;
      }
    })
    .delete('/tasks/:id', { name: 'tasks#destroy', preValidation: app.authenticate }, async (req, reply) => {
      const { id: taskId } = req.params;
      const task = await app.objection.models.task.query().findById(taskId);
      if (req.user.id !== task.creatorId) {
        req.flash('error', i18next.t('flash.tasks.delete.accessError'));
        return reply.redirect(app.reverse('tasks#index'));
      }
      await app.objection.models.task.transaction(async (trx) => {
        await task.$relatedQuery('labels', trx).unrelate();
        await task.$query(trx).delete();
      });

      req.flash('success', i18next.t('flash.tasks.delete.success'));
      return reply.redirect(app.reverse('tasks#index'));
    })
    .get('/tasks/:id', { name: 'tasks#show', preValidation: app.authenticate }, async (req, reply) => {
      const task = await
      app.objection.models.task.query().withGraphJoined('[status, creator, executor, labels]').findById(req.params.id);
      reply.render('tasks/singleTask', { task });
      return reply;
    });
};
