var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { checkAction } from './helpers';
import { compose } from 'redux';
import { getActionPolices } from './polices';

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

var fieldsToClean = ['polices', 'url', 'method'];
var cleanMeta = function cleanMeta(meta) {
  return Object.keys(meta).filter(function (key) {
    return fieldsToClean.indexOf(key) < 0;
  }).reduce(function (acc, key) {
    var _extends2;

    return _extends({}, acc, (_extends2 = {}, _extends2[key] = meta[key], _extends2));
  }, {});
};

function execAsyncTask(requestType, asyncTask) {
  return function (store) {
    return function (next) {
      return function (action) {
        store.dispatch({ type: requestType, meta: cleanMeta(action.meta) });

        var done = function done(err, response) {
          return err ? next(action, err, null) : next(action, null, response);
        };

        // flatten the action
        var options = _extends({ payload: action.payload }, action.meta);
        return asyncTask({ getState: store.getState })(done)(options);
      };
    };
  };
}

function handleResponse(responseType) {
  return function (store) {
    return function (action, err, response) {
      var responseAction = {
        type: responseType,
        meta: cleanMeta(action.meta),
        payload: response
      };
      if (err) {
        var actionToDispatch = _extends({}, responseAction, { error: true });
        store.dispatch(actionToDispatch);
        return err;
      }
      store.dispatch(responseAction);
      return response;
    };
  };
}

export function createAsyncMiddleware(asyncTask) {
  if (typeof asyncTask !== 'function') {
    var warning = 'You must provide a asyncTask function to createAsyncMiddleware, with the following signature: ';
    var example = 'done => (action, error, response) => done(action, error, response)';
    throw new Error(warning + ' \n ' + example);
  }

  return function (store) {
    return function (next) {
      return function (action) {
        var type = action.type,
            meta = action.meta;


        if (!Array.isArray(type)) {
          return next(action);
        }

        if (!checkAction(type)) {
          throw new Error('Expected type to be an array of two strings, request and response.');
        }

        if (!meta || typeof meta !== 'object') {
          throw new Error('Expected meta to be an object');
        }

        var actionPolices = getActionPolices(action.meta.polices);
        var _action$type = action.type,
            requestType = _action$type[0],
            responseType = _action$type[1];


        var chain = [actionPolices('beforeRequest'), execAsyncTask(requestType, asyncTask), actionPolices('onResponse')].map(function (middleware) {
          return middleware(store);
        });

        var done = handleResponse(responseType)(store);
        return compose.apply(undefined, chain)(done)(action);
      };
    };
  };
}

export default {
  createAsyncMiddleware: createAsyncMiddleware
};