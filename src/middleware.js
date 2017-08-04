import { checkAction } from './helpers';
import { compose } from 'redux';
import { getActionPolicies } from './policies';

/**
* This is a standard Redux middleware that listens for async actions
* This middleware waits as its first param, a function with the following signature
* done => (action, response) => done(action, error, response)
*
* The actions for this middleware, should look like the following
*  {
*    type: ['REQUEST_TYPE', 'RESPONSE_TYPE'],
*    payload: {},
*    meta: {
*      ...allAdditionalData
*    },
*  }
* @param {Object} asyncTask - function that executes the async task
*/

function execAsyncTask(requestType, asyncTask) {
  return store => next => (action) => {
    store.dispatch({ type: requestType, meta: action.meta });

    const done = (err, response) => err
      ? next(action, err, null)
      : next(action, null, response);

    const options = { payload: action.payload, ...action.meta };
    return asyncTask({ getState: store.getState })(done)(options);
  };
}

function handleResponse(responseType) {
  return store => (action, err, response) => {
    const responseAction = {
      type: responseType,
      meta: action.meta,
      payload: response,
    };
    if (err) {
      const actionToDispatch = { ...responseAction, error: true };
      store.dispatch(actionToDispatch);
      return err;
    }
    store.dispatch(responseAction);
    return response;
  };
}

export function createAsyncMiddleware(asyncTask) {
  if (typeof asyncTask !== 'function') {
    const warning =
      'You must provide a asyncTask function to createAsyncMiddleware, with the following signature: ';
    const example = 'done => (action, error, response) => done(action, error, response)';
    throw new Error(`${warning} \n ${example}`)
  }

  return store => next => (action) => {
    const { type, meta } = action;

    if (!Array.isArray(type)) {
      return next(action);
    }

    if (!checkAction(type)) {
      throw new Error('Expected type to be an array of two strings, request and response.');
    }

    if (!meta || typeof meta !== 'object') {
      throw new Error('Expected meta to be an object');
    }

    const actionPolicies = getActionPolicies(action.meta.policies);
    const [requestType, responseType] = action.type;

    const chain = [
      actionPolicies('beforeRequest'),
      execAsyncTask(requestType, asyncTask),
      actionPolicies('onResponse'),
    ].map(middleware => middleware(store));

    const done = handleResponse(responseType)(store);
    return compose(...chain)(done)(action);
  };
}

export default {
  createAsyncMiddleware,
}
