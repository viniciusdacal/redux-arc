import { parseToUppercase } from './utils';
import toApiExternalType from './toApiExternalType';

function getParser(singleConfig) {
  return !singleConfig || !singleConfig.url
    ? actionType => actionType
    : toApiExternalType;
}

export default function toExternalType(config, actionTypes) {
  return Object.keys(actionTypes).reduce((acc, key) => {
    const parse = getParser(config[key])

    return {
      ...acc,
      [parseToUppercase(key)]: parse(actionTypes[key])
    }
  }, {});
}
