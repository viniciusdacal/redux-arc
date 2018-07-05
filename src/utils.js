export const isString = str => typeof str === 'string';
export const checkAction = type => type.length === 2 && type.every(isString);
export const parseToUppercase = (str) => str.replace(/([A-Z])/g, '_$1').toUpperCase();

export const removeNamespace = (str, NAMESPACE) => str.replace(`${NAMESPACE}_`, '');

export const toAsyncTypes = (type) => [`${type}_REQUEST`, `${type}_RESPONSE`];
