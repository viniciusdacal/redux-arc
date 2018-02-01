import { removeNamespace } from '../utils';

export default function toTypesByActionNames(actionTypes, NAMESPACE) {
  return Object.keys(actionTypes).reduce((acc, key) => ({
    ...acc,
    [removeNamespace(actionTypes[key], NAMESPACE)]: actionTypes[key],
  }), {});
}
