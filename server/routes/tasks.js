// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks#index', preValidation: app.authenticate }, async (req, reply) => {
      const taskStatuses = await app.objection.models.taskStatus.query();
      const users = await app.objection.models.user.query();
      const taskLabels = await app.objection.models.taskLabel.query();
      // const taskQuery = app.objection.models.task.query();
      // if (Object.keys(req.query).length !== 0) {
      //   const queryContent = req.query;
      //   let filterQuery;
      //   let executorQuery;
      //   let labelsQuery;
      //   let userQuery;
      //   if (queryContent.status !== '') {
      //     filterQuery = taskQuery.where('status_id', '=', queryContent.status);
      //   } else {
      //     filterQuery = taskQuery;
      //   }
      //   if (queryContent.executor !== '') {
      //     executorQuery = filterQuery.where('executor_id', '=', queryContent.executor);
      //   } else {
      //     executorQuery = filterQuery;
      //   }
      //   const tasksFound = executorQuery.withGraphJoined('[status, creator, executor, labels]');
      //   if (queryContent.label !== '') {
      //     labelsQuery = tasksFound.select('*')
      // .join('task_labels_relations', function labelSearch() {
      //       this.on('labels.id', '=', 'task_labels_relations.label_id');
      //     }).where('labels.id', '=', queryContent.label);
      //   } else {
      //     labelsQuery = tasksFound;
      //   }
      //   if (queryContent.isCreatorUser === 'on') {
      //     userQuery = await labelsQuery.where('creator_id', '=', req.user.id);
      //   } else {
      //     userQuery = await labelsQuery;
      //   }
      //   reply.render('tasks/index', {
      //     tasks: userQuery, taskStatuses, users, taskLabels,
      //   });
      //   return reply;
      // }

      const tasks = await app.objection.models.task.query()
        .modify((builder) => {
          if (req.query.status) {
            builder.where('status_id', '=', Number(req.query.status));
          }
        })
        .modify((builder) => {
          if (req.query.executor) {
            builder.where('executor_id', '=', Number(req.query.executor));
          }
        })
        .modify((builder) => {
          if (req.query.creatorUser) {
            builder.where('creator_id', '=', Number(req.user.id));
          }
        })
        .withGraphJoined('[status, creator, executor, labels]')
        .modify((builder) => {
          if (req.query.label) {
            builder.where('label_id', '=', Number(req.query.label));
          }
        });
      reply.render('tasks/index', {
        tasks, taskStatuses, users, taskLabels,
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
        // eslint-disable-next-line no-unused-expressions
        executorId !== '' ? taskData.executorId = Number(executorId) : null;
        const labelsIds = _.toArray(_.get(req.body.data, 'labels', []));
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
      // eslint-disable-next-line no-unused-expressions
      executorId !== '' ? taskData.executorId = Number(executorId) : null;
      const labelsIds = _.toArray(_.get(req.body.data, 'labels', []));
      const thisTaskLabels = await app.objection.models.taskLabel.query().findByIds(labelsIds);
      try {
        await app.objection.models.task.transaction(async (trx) => {
          await task.$relatedQuery('labels', trx).unrelate();
          await task.$query(trx).patch(taskData);
          await Promise.all(thisTaskLabels.map((label) => task.$relatedQuery('labels', trx).relate(label)));
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
      const currentUserId = req.user.id;
      const taskId = req.params.id;
      const task = await app.objection.models.task.query().findById(taskId);
      if (currentUserId !== task.creatorId) {
        req.flash('error', i18next.t('flash.tasks.delete.accessError'));
        return reply.redirect(app.reverse('tasks#index'));
      }
      await app.objection.models.task.query().deleteById(taskId);
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
