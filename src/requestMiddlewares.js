import { compose } from 'redux';

/**
* This is a middleware manager, which is used to register,
* get and run middlewares over actions and responses
*
* A middleware is a middleware, and it should follow the signature bellow
* store => done => (action, error, response) => done(action, error, response);
* A middleware must have a applyPoint property. The available apply points are:
* 'beforeRequest', 'onResponse'
*/

const applyPoints = ['beforeRequest', 'onResponse'];

export const globalMiddlewares = {};

export function reset() {
  Object.keys(globalMiddlewares).forEach((key) => {
    delete globalMiddlewares[key];
  });
};

export function register(name, middleware) {
  if (globalMiddlewares[name]) {
    throw new Error(`Called register with middleware: ${name} more than once`);
  }

  if (applyPoints.indexOf(middleware.applyPoint) < 0) {
    const invalid = `Invalid applyPoint: ${middleware.applyPoint}, provided with middleware: ${name}.`;
    const available = `The apply points available are: ${applyPoints.join(', ')}`;
    throw new Error(`${invalid} ${available}`);
  }
  Object.assign(globalMiddlewares, { [name]: middleware })
}

const get = middlewareNames => (applyPoint) => {
  const middlewares = middlewareNames
    .map(name => globalMiddlewares[name])
    .filter(middleware => middleware.applyPoint === applyPoint);

  return store => done => {
    const chain = middlewares.map(middleware => middleware(store));
    return compose(...chain)(done);
  };
};

export function validateMiddleware(middlewares) {
  middlewares.forEach(middlewareName => {
    if (!globalMiddlewares[middlewareName]) {
      throw new Error(`Request Middleware ${middlewareName} not registered. Perhaps you forgot to import its file`)
    }
  });
}

export function getRequestMiddlewares(middlewares) {
  if (!Array.isArray(middlewares)) {
    return get([]);
  }
  validateMiddleware(middlewares);
  return get(middlewares);
};

export default {
  globalMiddlewares,
  register,
  getRequestMiddlewares,
  reset,
};
