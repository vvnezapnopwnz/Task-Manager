// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      console.log(req.body.data);
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })
    .get('/users/:id/edit', { name: '/users/:id/edit', preValidation: app.authenticate }, async (req, reply) => {
      const currentUserId = req.user.id;
      const userId = _.toNumber(req.params.id);
      if (currentUserId !== userId) {
        req.flash('error', i18next.t('flash.users.edit.anotherUserError'));
        return reply.redirect(app.reverse('users'));
      }
      const user = await app.objection.models.user.query().findById(currentUserId);
      reply.send(user);
      return reply;
    })
    .delete('/users/:id', { name: '/users#delete', preValidation: app.authenticate }, async (req, reply) => {
      const currentUserId = req.user.id;
      const userId = _.toNumber(req.params.id);
      if (currentUserId !== userId) {
        req.flash('error', i18next.t('flash.users.delete.anotherUserError'));
        return reply.redirect(app.reverse('users'));
      }
      await app.objection.models.user.query().deleteById(currentUserId);
      await req.logOut();
      req.flash('success', i18next.t('flash.users.delete.success'));
      return reply.redirect(app.reverse('users'));
    });
};
