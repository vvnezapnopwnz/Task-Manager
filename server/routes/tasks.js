// @ts-check

import i18next from 'i18next';
// import _ from 'lodash';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks#index', preValidation: app.authenticate }, async (req, reply) => {
      const tasks = await app.objection.models.task.query().withGraphJoined('[status, creator, executor]').debug();
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'tasks#edit', preValidation: app.authenticate }, async (req, reply) => {
      const task = await
      app.objection.models.task.query().withGraphJoined('[status, creator, executor]').findById(req.params.id).debug();
      // reply.send(task);
      const taskStatuses = await app.objection.models.taskStatus.query().debug();
      const users = await app.objection.models.user.query();
      reply.render('tasks/edit', { task, taskStatuses, users });
      return reply;
    })
    .get('/tasks/new', { name: 'tasks#new', preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const taskStatuses = await app.objection.models.taskStatus.query().debug();
      const users = await app.objection.models.user.query();
      reply.render('tasks/new', {
        task, taskStatuses, users,
      });
      return reply;
    })
    .post('/tasks', { name: 'tasks#create', preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
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
      // eslint-disable-next-line no-unused-expressions
      executorId !== '' ? taskData.executorId = Number(executorId) : null;
      task.$set(taskData);
      try {
        const validtask = await app.objection.models.task
          .fromJson(taskData);
        await app.objection.models.task.query().insert(validtask);
        req.flash('success', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks#index'));
        return reply;
      } catch ({ data }) {
        const taskStatuses = await app.objection.models.taskStatus.query().debug();
        const users = await app.objection.models.user.query();
        req.flash('error', i18next.t('flash.tasks.new.error'));
        return reply.render('tasks/new', {
          task, taskStatuses, users, errors: data,
        });
      }
    })
    .patch('/tasks/:id/', { name: 'tasks#update', preValidation: app.authenticate }, async (req, reply) => {
      const taskId = req.params.id;
      const {
        name, description, statusId, executorId,
      } = req.body.data;
      const taskData = {
        name,
        description,
        statusId: Number(statusId),
      };
      // eslint-disable-next-line no-unused-expressions
      executorId !== '' ? taskData.executorId = Number(executorId) : taskData.executorId = null;
      const task = await app.objection.models.task.query().findById(taskId);
      task.$set(taskData);
      try {
        await task.$query().patch(taskData);
        req.flash('success', i18next.t('flash.tasks.edit.success'));
        return reply.redirect(app.reverse('tasks#index'));
      } catch ({ data: errors }) {
        const taskStatuses = await app.objection.models.taskStatus.query().debug();
        const users = await app.objection.models.user.query();
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/edit', {
          task, taskStatuses, users, errors,
        });
        return reply;
      }
    })
    .delete('/tasks/:id', { name: 'tasks#destroy', preValidation: app.authenticate }, async (req, reply) => {
      const taskId = req.params.id;
      await app.objection.models.task.query().deleteById(taskId);
      req.flash('success', i18next.t('flash.tasks.delete.success'));
      return reply.redirect(app.reverse('tasks#index'));
    })
    .get('/tasks/:id', { name: 'tasks#show', preValidation: app.authenticate }, async (req, reply) => {
      const task = await
      app.objection.models.task.query().withGraphJoined('[status, creator, executor]').findById(req.params.id).debug();
      reply.render('tasks/singleTask', { task });
      return reply;
    });
};
