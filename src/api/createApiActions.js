import validateConfig from './validateConfig';
import { parseToUppercase } from '../utils';
import createCreators from '../createCreators';
import createTypes from '../createTypes';
import apiActionCreatorFactory from './apiActionCreatorFactory';
import toTypesByActionNames from './toTypesByActionNames';

export default function createApiActions(namespace, config) {
  const NAMESPACE = parseToUppercase(namespace);

  validateConfig(NAMESPACE, config);

  const actionKeys = Object.keys(config);
  const actionTypes = createTypes(actionKeys, NAMESPACE);
  const creators = createCreators(config, actionTypes, apiActionCreatorFactory);

  return {
    creators,
    types: toTypesByActionNames(actionTypes),
  };
}
