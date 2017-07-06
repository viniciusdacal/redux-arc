'use strict';

exports.__esModule = true;
var isString = exports.isString = function isString(str) {
  return typeof str === 'string';
};
var checkAction = exports.checkAction = function checkAction(type) {
  return type.length === 2 && type.every(isString);
};