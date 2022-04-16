// @ts-check

import welcome from './welcome.js';
import users from './users.js';
import session from './session.js';
import taskStatuses from './taskStatuses.js';

const controllers = [
  welcome,
  users,
  session,
  taskStatuses,
];

export default (app) => controllers.forEach((f) => f(app));
