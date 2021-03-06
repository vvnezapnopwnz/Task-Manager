// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app
    .get('/users', { name: 'users#index' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'users#new' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', { name: 'users#create' }, async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root#index'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.code(302).render('users/new', { user, errors: data });
      }

      return reply;
    })
    .get('/users/:id/edit', { name: 'users#edit', preValidation: app.authenticate }, async (req, reply) => {
      const currentUserId = req.user.id;
      const userId = _.toNumber(req.params.id);
      if (currentUserId !== userId) {
        req.flash('error', i18next.t('flash.users.edit.anotherUserError'));
        return reply.redirect(app.reverse('users#index'));
      }
      const user = await app.objection.models.user.query().findById(currentUserId);
      reply.code(200).render('users/edit', { user });
      return reply;
    })
    .patch('/users/edit', { name: 'users#patch', preValidation: app.authenticate }, async (req, reply) => {
      const userId = req.user.id;
      const newData = req.body.data;
      const user = await app.objection.models.user.query().findById(userId);
      try {
        await user.$query().patch(newData);
        req.flash('success', i18next.t('flash.users.edit.success'));
        return reply.redirect(app.reverse('users#index'));
      } catch ({ data: errors }) {
        user.$set(newData);
        reply.code(422).render('users/edit', { user, errors });
        return reply;
      }
    })
    .delete('/users/:id', { name: 'users#delete', preValidation: app.authenticate }, async (req, reply) => {
      const currentUserId = req.user.id;
      const userId = _.toNumber(req.params.id);
      const tasks = await app.objection.models.task.query()
        .where('creatorId', userId)
        .orWhere('executorId', userId);
      if (currentUserId !== userId) {
        req.flash('error', i18next.t('flash.users.delete.anotherUserError'));
        return reply.redirect(app.reverse('users#index'));
      }
      if (tasks.length !== 0) {
        req.flash('error', i18next.t('flash.users.delete.anotherUserError'));
        return reply.redirect(app.reverse('users#index'));
      }
      await app.objection.models.user.query().deleteById(currentUserId);
      await req.logOut();
      req.flash('success', i18next.t('flash.users.delete.success'));
      return reply.redirect(app.reverse('users#index'));
    });
};
