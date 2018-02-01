import { parseToUppercase } from '../utils';
import createTypes from '../createTypes';
import createCreators from '../createCreators';
import validateConfig from './validateConfig';
import actionCreatorFactory from './actionCreatorFactory';
import toTypesByActionNames from './toTypesByActionNames';

const DEFAULT_CONFIG = {};

const fsaConfigToConfig = fsaConfig => fsaConfig.reduce((acc, actionNameOrConfig) => {
  if (typeof actionNameOrConfig === 'string') {
    return { ...acc, [actionNameOrConfig]: DEFAULT_CONFIG }
  }

  const { action, ...config } = actionNameOrConfig;
  return {
    ...acc,
    [action]: config,
  };
}, {})

/*
  @param {string} namespace - namespace to be uppercased and prefix your action types
  @param {Array} fsaConfig - array of names or config objects with an action name
*/
export default function createActions(namespace, fsaConfig) {
  const NAMESPACE = parseToUppercase(namespace);
  validateConfig(NAMESPACE, fsaConfig);

  const config = fsaConfigToConfig(fsaConfig);

  const actionKeys = Object.keys(config);
  const actionTypes = createTypes(actionKeys, NAMESPACE);
  const creators = createCreators(config, actionTypes, actionCreatorFactory);

  return {
    creators,
    types: toTypesByActionNames(actionTypes, NAMESPACE),
  };
}
