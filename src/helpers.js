export const isString = str => typeof str === 'string';
export const checkAction = type => type.length === 2 && type.every(isString);
