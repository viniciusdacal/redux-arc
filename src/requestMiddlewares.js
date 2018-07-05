import { compose } from 'redux';

/**
* This is a middleware manager, which is used to get get and run middlewares
* over actions and responses
*
* A request middleware should follow the signature below
* store => done => (action, error, response) => done(action, error, response);
* A middleware must have an applyPoint property. The available apply points are:
* 'onRequest' and 'onResponse'
*/

const applyPoints = ['onRequest', 'onResponse'];

const notEmpty = item => !!item;

export function validateMiddleware(middlewares) {
  middlewares.forEach(middleware => {
    if (typeof middleware !== 'function') {
      throw new Error(`All middlewares should be functions: [${middlewares}]`);
    }

    if (applyPoints.indexOf(middleware.applyPoint) < 0) {
      const invalid = `Invalid applyPoint: ${middleware.applyPoint}, provided with middleware: ${middleware.name}.`;
      const available = `The apply points available are: ${applyPoints.join(', ')}`;
      throw new Error(`${invalid} ${available}`);
    }
  });
}

const withApplyPoint = applyPoint => middleware => middleware.applyPoint === applyPoint;

const get = middlewares => (applyPoint) => {
  const applyMiddlewares = middlewares.filter(withApplyPoint(applyPoint));

  return store => done => {
    const chain = applyMiddlewares.map(middleware => middleware(store));
    return compose(...chain)(done);
  };
};

export function getRequestMiddlewares(middlewares) {
  if (!Array.isArray(middlewares)) {
    return get([]);
  }
  const actualMiddlewares = middlewares.filter(notEmpty);
  validateMiddleware(actualMiddlewares);

  return get(actualMiddlewares);
};

export default {
  getRequestMiddlewares,
};
