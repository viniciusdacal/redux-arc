var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { reduceActionTypes, parseToUppercase, createTypes, createCreators, parseOptions } from './asyncActionHelpers';

export function apiActionCreatorFactory(config, types, prefix) {
  function apiCreator(options) {
    var _ref = parseOptions(options, config) || {},
        payload = _ref.payload,
        params = _objectWithoutProperties(_ref, ['payload']);

    var action = {
      type: [types.REQUEST, types.RESPONSE],
      meta: _extends({}, params, {
        url: parseUrl(config.url, params),
        method: config.method
      })
    };

    if (payload) {
      action.payload = payload;
    }

    if (config.meta) {
      action.meta = _extends({}, config.meta, action.meta);
    }

    if (config.schema) {
      action.meta.schema = config.schema;
    }

    if (config.polices) {
      action.meta.polices = config.polices;
    }

    return action;
  }

  Object.defineProperty(apiCreator, 'name', { value: '' + prefix + types.uppercaseName + ' apiCreator', writable: false });

  return apiCreator;
}

export function parseUrl(url, params) {
  return url.replace(/(:)([A-Za-z0-9]*)/g, function (match, $1, $2) {
    var paramType = typeof params[$2];
    if (paramType !== 'string' && paramType !== 'number') {
      throw new Error('Param ' + $1 + ' from url ' + url + ', not found in params object');
    }
    return params[$2];
  });
}

export function validateConfig(configs, options) {
  Object.keys(configs).forEach(function (creatorName) {
    var config = configs[creatorName];
    var configName = '' + (options && options.prefix) + parseToUppercase(creatorName);

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

  if (options && options.prefix && typeof options.prefix !== 'string') {
    throw new Error('Invalid prefix provided to options: ' + options.prefix + ', it should be a string');
  }
}

export function createApiActions(config, options) {
  validateConfig(config, options);
  var actionKeys = Object.keys(config);
  var actionTypes = createTypes(actionKeys, options && options.prefix);
  var creators = createCreators(config, actionTypes, options.prefix, apiActionCreatorFactory);

  return {
    creators: creators,
    types: reduceActionTypes(actionTypes)
  };
}

export default {
  createApiActions: createApiActions,
  apiActionCreatorFactory: apiActionCreatorFactory,
  parseUrl: parseUrl,
  validateConfig: validateConfig
};