export var isString = function isString(str) {
  return typeof str === 'string';
};
export var checkAction = function checkAction(type) {
  return type.length === 2 && type.every(isString);
};