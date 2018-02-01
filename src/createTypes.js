import { parseToUppercase } from './utils';

export default function createTypes(actionKeys, NAMESPACE) {
  return actionKeys.reduce((acc, actionName) => ({
    ...acc,
    [actionName]: `${NAMESPACE}_${parseToUppercase(actionName)}`,
  }), {});
};
