'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.apiActionCreatorFactory = apiActionCreatorFactory;
exports.parseUrl = parseUrl;
exports.validateConfig = validateConfig;
exports.createApiActions = createApiActions;

var _asyncActionHelpers = require('./asyncActionHelpers');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function apiActionCreatorFactory(config, types, namespace) {
  function apiCreator(options) {
    var _ref = (0, _asyncActionHelpers.parseOptions)(options, config) || {},
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
    var configName = namespace + '_' + (0, _asyncActionHelpers.parseToUppercase)(creatorName);

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
  var upNamespace = (0, _asyncActionHelpers.parseToUppercase)(namespace);
  validateConfig(upNamespace, config);
  var actionKeys = Object.keys(config);
  var actionTypes = (0, _asyncActionHelpers.createTypes)(actionKeys, upNamespace);
  var creators = (0, _asyncActionHelpers.createCreators)(config, actionTypes, upNamespace, apiActionCreatorFactory);

  return {
    creators: creators,
    types: (0, _asyncActionHelpers.reduceActionTypes)(actionTypes)
  };
}

exports['default'] = {
  createApiActions: createApiActions,
  apiActionCreatorFactory: apiActionCreatorFactory,
  parseUrl: parseUrl,
  validateConfig: validateConfig
};