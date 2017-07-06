'use strict';

exports.__esModule = true;
exports.getActionPolices = exports.register = exports.reset = exports.globalPolices = undefined;

var _redux = require('redux');

/**
* This is a police manager, which is used to register,
* get and run polices over actions and responses
*
* A police is a middleware, and it should follow the signature bellow
* store => done => (action, error, response) => done(action, error, response);
* A police must have a applyPoint property. The available apply points are:
* 'beforeRequest', 'onResponse'
*/

var applyPoints = ['beforeRequest', 'onResponse'];

var globalPolices = exports.globalPolices = {};

var reset = exports.reset = function reset() {
  Object.keys(globalPolices).forEach(function (key) {
    delete globalPolices[key];
  });
};

var register = exports.register = function register(name, police) {
  var _Object$assign;

  if (globalPolices[name]) {
    throw new Error('Called register with police: ' + name + ' more than once');
  }

  if (applyPoints.indexOf(police.applyPoint) < 0) {
    var invalid = 'Invalid applyPoint: ' + police.applyPoint + ', provided with police: ' + name + '.';
    var available = 'The apply points available are: ' + applyPoints.join(', ');
    throw new Error(invalid + ' ' + available);
  }
  Object.assign(globalPolices, (_Object$assign = {}, _Object$assign[name] = police, _Object$assign));
};

var get = function get(policeNames) {
  return function (applyPoint) {
    var polices = policeNames.map(function (name) {
      return globalPolices[name];
    }).filter(function (police) {
      return police.applyPoint === applyPoint;
    });

    return function (store) {
      return function (done) {
        var chain = polices.map(function (police) {
          return police(store);
        });
        return _redux.compose.apply(undefined, chain)(done);
      };
    };
  };
};

var getActionPolices = exports.getActionPolices = function getActionPolices(polices) {
  if (Array.isArray(polices)) {
    var policeNames = Object.keys(globalPolices).filter(function (key) {
      return polices.indexOf(key) >= 0;
    });
    return get(policeNames);
  }
  return get([]);
};

exports['default'] = {
  globalPolices: globalPolices,
  register: register,
  getActionPolices: getActionPolices,
  reset: reset
};