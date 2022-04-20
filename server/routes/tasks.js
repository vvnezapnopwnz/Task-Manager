// @ts-check

import i18next from 'i18next';
import { join } from 'node:path/win32';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks#index', preValidation: app.authenticate }, async (req, reply) => {
      // const tasks = await app.objection.models.task.query().$relatedQuery('task_statuses');
      const tasks2 = await app.objection.models.task.query().withGraphJoined('[status, creator, executor]').debug();
        // .join('task_statuses', 'tasks.statusId', '=', 'task_statuses.id')
        // .join('users AS creators', 'tasks.creatorId', '=', 'creators.id')
        // .join('users AS executors', 'tasks.executorId', '=', 'executors.id')
        // .select(
        //   'tasks.id',
        //   'tasks.description',
        //   'tasks.createdAt',
        //   'tasks.name as taskName',
        //   'task_statuses.name as taskStatusName',
        //   'creators.firstName as creatorFirstName',
        //   'creators.lastName as creatorLastName',
        //   'executors.firstName as exectutorFirstName',
        //   'executors.lastName as exectutorLastName',
        //   '*',
        // );
        reply.send(tasks2);
      // reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { name: 'tasks#new', preValidation: app.authenticate }, async (req, reply) => {
      // const tasks = await app.objection.models.task.query().insert(
      //   {
      //     name: 'test2',
      //     description: 'sddf3',
      //     statusId: 2,
      //     creatorId: 1,
      //     executorId: 1,
      //   },
      // );

      // reply.send(tasks);
      // return reply;
      // return reply.send(tasks);
    });
};
