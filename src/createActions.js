import { parseToUppercase } from './utils';
import createTypes from './createTypes';
import createCreators from './createCreators';
import validateConfig from './validateConfig';
import toExternalTypes from './toExternalTypes';

/*
  @param {string} namespace - namespace to be uppercased and prefix your action types
  @param {Array} config - object with options
*/
export default function createActions(namespace, config) {
  const NAMESPACE = parseToUppercase(namespace);
  validateConfig(NAMESPACE, config);

  const actionKeys = Object.keys(config);
  const actionTypes = createTypes(actionKeys, NAMESPACE);
  const creators = createCreators(config, actionTypes);

  return {
    creators,
    types: toExternalTypes(config, actionTypes),
  };
}
