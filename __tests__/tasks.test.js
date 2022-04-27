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
      url: app.reverse('session'),
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
    console.log(taskName);
    const task = await models.task.query()
      .findOne({ name: taskName });
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks#show', { id: task.id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  afterEach(async () => {
    await knex('tasks').truncate();
  });

  afterAll(async () => {
    await app.close();
  });
});
