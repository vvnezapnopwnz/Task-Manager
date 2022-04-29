import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify();
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
    await knex.migrate.latest();
  });

  beforeEach(async () => {
    await prepareData(app);
    const responseSignIn = await app.inject({
      method: 'POST',
      url: app.reverse('session#create'),
      payload: {
        data: testData.users.existing,
      },
    });
    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    cookie = { [name]: value };
  });

  it('statuses main page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses#index'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new status page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses#new'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create new status', async () => {
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('statuses#create'),
      payload: {
        data: testData.task_statuses.new,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);

    await expect(models.taskStatus.query().findOne({ name: testData.task_statuses.new.name }))
      .resolves
      .toMatchObject(testData.task_statuses.new);
  });

  it('edit status', async () => {
    const taskStatus = await models.taskStatus
      .query()
      .findOne({ name: testData.task_statuses.existing.name });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('statuses#edit', { id: taskStatus.id }),
      cookies: cookie,
    });

    await expect(response.statusCode).toBe(200);
  });

  it('patch: update status', async () => {
    const taskStatus = await models.taskStatus.query()
      .findOne({ name: testData.task_statuses.existing.name });

    const responseUpdate = await app.inject({
      method: 'PATCH',
      url: app.reverse('statuses#update', { id: taskStatus.id }),
      payload: {
        data: testData.task_statuses.editing,
      },
      cookies: cookie,
    });

    expect(responseUpdate.statusCode).toBe(302);
    await expect(models.taskStatus.query().findById(taskStatus.id))
      .resolves
      .toMatchObject(testData.task_statuses.editing);
  });

  it('delete status', async () => {
    const taskStatus = await models.taskStatus
      .query()
      .findOne({ name: testData.task_statuses.existing.name });

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('statuses#destroy', { id: taskStatus.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedStatus = await models.taskStatus
      .query()
      .findById(taskStatus.id);
    expect(deletedStatus).toBeUndefined();
  });

  afterEach(async () => {
    await knex('task_statuses').truncate();
  });

  afterAll(async () => {
    await app.close();
  });
});
