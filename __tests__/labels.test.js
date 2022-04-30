import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData } from './helpers/index.js';

describe('task_labels CRUD', () => {
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

  it('labels main page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels#index'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create new label page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels#new'),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('edit existing label page', async () => {
    const { id } = await models.taskLabel.query().findOne({ name: testData.labels.existing.name });

    const response = await app.inject({
      method: 'GET',
      url: app.reverse('labels#edit', { id }),
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new label creation', async () => {
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels#create'),
      payload: {
        data: testData.labels.new,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    await expect(models.taskLabel.query().findOne({ name: testData.labels.new.name }))
      .resolves
      .toMatchObject(testData.labels.new);
  });

  it('updating existing label', async () => {
    const { editing } = testData.labels;
    const taskLabel = await models.taskLabel.query()
      .findOne({ name: testData.labels.existing.name });

    const responseUpdate = await app.inject({
      method: 'PATCH',
      url: app.reverse('labels#update', { id: taskLabel.id }),
      payload: {
        data: editing,
      },
      cookies: cookie,
    });

    expect(responseUpdate.statusCode).toBe(302);
    await expect(models.taskLabel.query().findById(taskLabel.id))
      .resolves
      .toMatchObject(editing);
  });

  it('delete existing label', async () => {
    const { name } = testData.labels.existing;
    const { id } = await models.taskLabel.query().findOne({ name });

    const responseDelete = await app.inject({
      method: 'DELETE',
      url: app.reverse('labels#destroy', { id }),
      cookies: cookie,
    });

    expect(responseDelete.statusCode).toBe(302);
    await expect(models.taskLabel.query().findById(id))
      .resolves
      .toBeFalsy();
  });

  afterEach(async () => {
    knex('task_labels').truncate();
  });

  afterAll(async () => {
    await app.close();
  });
});
