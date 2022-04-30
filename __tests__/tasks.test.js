import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({ logger: { prettyPrint: true } });
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

  it('tasks main page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks#index'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('single Task', async () => {
    const taskName = testData.tasks.existing.name;
    const task = await models.task.query()
      .findOne({ name: taskName });
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks#show', { id: task.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new task page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks#new'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create new task', async () => {
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks#create'),
      payload: {
        data: testData.tasks.new,
      },
      cookies: cookie,
    });
    expect(response.statusCode).toBe(302);
    await expect(models.task.query().findOne({ name: testData.tasks.new.name }))
      .resolves
      .toMatchObject(testData.tasks.new);
  });

  it('edit existed task', async () => {
    const task = await models.task
      .query()
      .findOne({ name: testData.tasks.existing.name });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks#edit', { id: task.id }),
      cookies: cookie,
    });
    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const task = await models.task
      .query()
      .findOne({ name: testData.tasks.existing.name });

    const response = await app.inject({
      method: 'PATCH',
      url: app.reverse('tasks#update', { id: task.id }),
      payload: {
        data: testData.tasks.new,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const updatedTask = await models.task
      .query()
      .findById(task.id);
    expect(updatedTask).toMatchObject(testData.tasks.new);
  });

  it('delete', async () => {
    const task = await models.task
      .query()
      .findOne({ name: testData.tasks.existing.name });

    const response = await app.inject({
      method: 'DELETE',
      url: app.reverse('tasks#destroy', { id: task.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedTask = await models.task
      .query()
      .findOne({ name: testData.tasks.new.name });
    expect(deletedTask).toBeUndefined();
  });

  afterEach(async () => {
    await knex('tasks').truncate();
  });

  afterAll(async () => {
    await app.close();
  });
});
