(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('redux')) :
	typeof define === 'function' && define.amd ? define(['exports', 'redux'], factory) :
	(factory((global.ReduxArc = global.ReduxArc || {}),global.Redux));
}(this, (function (exports,redux) { 'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var parseToUppercase = function parseToUppercase(str) {
  return str.replace(/([A-Z])/g, '_$1').toUpperCase();
};

var createTypes = function createTypes(actionKeys, namespace) {
  return actionKeys.reduce(function (acc, actionName) {
    var _extends2;

    var uppercaseName = parseToUppercase(actionName);
    return _extends({}, acc, (_extends2 = {}, _extends2[actionName] = {
      uppercaseName: uppercaseName,
      REQUEST: namespace + '_' + uppercaseName + '_REQUEST',
      RESPONSE: namespace + '_' + uppercaseName + '_RESPONSE'
    }, _extends2));
  }, {});
};

function parseOptions(options, config) {
  if (typeof config.modifier === 'function') {
    return config.modifier(options);
  }
  return options;
}

var createCreators = function createCreators(config, actionTypes, namespace, factory) {
  return Object.keys(config).reduce(function (acc, creatorName) {
    var _extends3;

    return _extends({}, acc, (_extends3 = {}, _extends3[creatorName] = factory(config[creatorName], actionTypes[creatorName], namespace), _extends3));
  }, {});
};

var reduceActionTypes = function reduceActionTypes(actionTypes) {
  return Object.keys(actionTypes).reduce(function (acc, key) {
    var _extends4;

    var _actionTypes$key = actionTypes[key],
        uppercaseName = _actionTypes$key.uppercaseName,
        asyncTypes = _objectWithoutProperties(_actionTypes$key, ['uppercaseName']);

    return _extends({}, acc, (_extends4 = {}, _extends4[uppercaseName] = asyncTypes, _extends4));
  }, {});
};

var asyncActionHelpers = {
  parseToUppercase: parseToUppercase,
  createTypes: createTypes,
  parseOptions: parseOptions,
  createCreators: createCreators,
  reduceActionTypes: reduceActionTypes
};

/**
* This is a policy manager, which is used to register,
* get and run policies over actions and responses
*
* A policy is a middleware, and it should follow the signature bellow
* store => done => (action, error, response) => done(action, error, response);
* A policy must have a applyPoint property. The available apply points are:
* 'beforeRequest', 'onResponse'
*/

var applyPoints = ['beforeRequest', 'onResponse'];

var globalPolicies = {};

var reset = function reset() {
  Object.keys(globalPolicies).forEach(function (key) {
    delete globalPolicies[key];
  });
};

var register = function register(name, policy) {
  var _Object$assign;

  if (globalPolicies[name]) {
    throw new Error('Called register with policy: ' + name + ' more than once');
  }

  if (applyPoints.indexOf(policy.applyPoint) < 0) {
    var invalid = 'Invalid applyPoint: ' + policy.applyPoint + ', provided with policy: ' + name + '.';
    var available = 'The apply points available are: ' + applyPoints.join(', ');
    throw new Error(invalid + ' ' + available);
  }
  Object.assign(globalPolicies, (_Object$assign = {}, _Object$assign[name] = policy, _Object$assign));
};

var get = function get(policyNames) {
  return function (applyPoint) {
    var policies = policyNames.map(function (name) {
      return globalPolicies[name];
    }).filter(function (policy) {
      return policy.applyPoint === applyPoint;
    });

    return function (store) {
      return function (done) {
        var chain = policies.map(function (policy) {
          return policy(store);
        });
        return redux.compose.apply(undefined, chain)(done);
      };
    };
  };
};

var getActionPolicies = function getActionPolicies(policies) {
  if (Array.isArray(policies)) {
    var policyNames = Object.keys(globalPolicies).filter(function (key) {
      return policies.indexOf(key) >= 0;
    });
    return get(policyNames);
  }
  return get([]);
};

var policies = {
  globalPolicies: globalPolicies,
  register: register,
  getActionPolicies: getActionPolicies,
  reset: reset
};

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties$1(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function apiActionCreatorFactory(config, types, namespace) {
  function apiCreator(options) {
    var _ref = parseOptions(options, config) || {},
        payload = _ref.payload,
        params = _objectWithoutProperties$1(_ref, ['payload']);

    var action = {
      type: [types.REQUEST, types.RESPONSE],
      meta: _extends$1({}, params, {
        url: parseUrl(config.url, params),
        method: config.method
      })
    };

    if (payload) {
      action.payload = payload;
    }

    if (config.meta) {
      action.meta = _extends$1({}, config.meta, action.meta);
    }

    if (config.schema) {
      action.meta.schema = config.schema;
    }

    if (config.policies) {
      action.meta.policies = config.policies;
    }

    return action;
  }

  Object.defineProperty(apiCreator, 'name', {
    value: namespace + '_' + types.uppercaseName + ' apiCreator',
    writable: false
  });

  return apiCreator;
}

function parseUrl(url, params) {
  return url.replace(/(:)([A-Za-z0-9]*)/g, function (match, $1, $2) {
    var paramType = typeof params[$2];
    if (paramType !== 'string' && paramType !== 'number') {
      throw new Error('Param ' + $1 + ' from url ' + url + ', not found in params object');
    }
    return params[$2];
  });
}

function validateConfig(namespace, configs) {
  Object.keys(configs).forEach(function (creatorName) {
    var config = configs[creatorName];
    var configName = namespace + '_' + parseToUppercase(creatorName);

    if (typeof config.url !== 'string') {
      throw new Error('Invalid url, ' + config.url + ', provided for ' + configName + ', it should be a string');
    }
    if (/:payload*/g.test(config.url)) {
      throw new Error('Invalid url, ' + config.url + ', provided for ' + configName + ', you cannot use payload as a param');
    }
    if (typeof config.method !== 'string' || !config.method.length) {
      throw new Error('Invalid method,  ' + config.method + ', provided for ' + configName + ', it should be a string');
    }
    if (config.modifier && typeof config.modifier !== 'function') {
      throw new Error('Invalid modifier handler, ' + config.modifier + ', provided for ' + configName + ', it should be a function');
    }
  });

  if (!namespace || typeof namespace !== 'string') {
    throw new Error('Invalid namespace provided: ' + namespace + ', it should be a string');
  }
}

function createApiActions(namespace, config, options) {
  var upNamespace = parseToUppercase(namespace);
  validateConfig(upNamespace, config);
  var actionKeys = Object.keys(config);
  var actionTypes = createTypes(actionKeys, upNamespace);
  var creators = createCreators(config, actionTypes, upNamespace, apiActionCreatorFactory);

  return {
    creators: creators,
    types: reduceActionTypes(actionTypes)
  };
}

var isString = function isString(str) {
  return typeof str === 'string';
};
var checkAction = function checkAction(type) {
  return type.length === 2 && type.every(isString);
};

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
  return function (store) {
    return function (next) {
      return function (action) {
        store.dispatch({ type: requestType, meta: action.meta });

        var done = function done(err, response) {
          return err ? next(action, err, null) : next(action, null, response);
        };

        var options = _extends$2({ payload: action.payload }, action.meta);
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
        meta: action.meta,
        payload: response
      };
      if (err) {
        var actionToDispatch = _extends$2({}, responseAction, { error: true });
        store.dispatch(actionToDispatch);
        return err;
      }
      store.dispatch(responseAction);
      return response;
    };
  };
}

function createAsyncMiddleware(asyncTask) {
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

        var actionPolicies = getActionPolicies(action.meta.policies);
        var _action$type = action.type,
            requestType = _action$type[0],
            responseType = _action$type[1];


        var chain = [actionPolicies('beforeRequest'), execAsyncTask(requestType, asyncTask), actionPolicies('onResponse')].map(function (middleware) {
          return middleware(store);
        });

        var done = handleResponse(responseType)(store);
        return redux.compose.apply(undefined, chain)(done)(action);
      };
    };
  };
}

exports.asyncActionHelpers = asyncActionHelpers;
exports.policies = policies;
exports.createApiActions = createApiActions;
exports.createAsyncMiddleware = createAsyncMiddleware;

Object.defineProperty(exports, '__esModule', { value: true });

})));
