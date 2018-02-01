import { toAsyncTypes, parseToUppercase } from '../utils';

export default function toTypesByActionNames(actionTypes) {
  return Object.keys(actionTypes).reduce((acc, key) => {
    const asyncTypes = toAsyncTypes(actionTypes[key]);

    return {
      ...acc,
      [parseToUppercase(key)]: {
        REQUEST: asyncTypes[0],
        RESPONSE: asyncTypes[1],
      },
    };
  }, {});
}
