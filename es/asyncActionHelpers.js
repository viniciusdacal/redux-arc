var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

export var parseToUppercase = function parseToUppercase(str) {
  return str.replace(/([A-Z])/g, '_$1').toUpperCase();
};

export var createTypes = function createTypes(actionKeys, namespace) {
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

export function parseOptions(options, config) {
  if (typeof config.modifier === 'function') {
    return config.modifier(options);
  }
  return options;
}

export var createCreators = function createCreators(config, actionTypes, namespace, factory) {
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

    var action = {
      actionTypes: actionTypes
    };
    return _extends({}, acc, (_extends4 = {}, _extends4[uppercaseName] = asyncTypes, _extends4));
  }, {});
};

export { reduceActionTypes };
export default {
  parseToUppercase: parseToUppercase,
  createTypes: createTypes,
  parseOptions: parseOptions,
  createCreators: createCreators,
  reduceActionTypes: reduceActionTypes
};