export const parseToUppercase = (str) => str.replace(/([A-Z])/g, '_$1').toUpperCase();

export const createTypes = (actionKeys, namespace) => actionKeys.reduce((acc, actionName) => {
  const uppercaseName = parseToUppercase(actionName);
  return {
    ...acc,
    [actionName]: {
      uppercaseName,
      REQUEST: `${namespace}_${uppercaseName}_REQUEST`,
      RESPONSE: `${namespace}_${uppercaseName}_RESPONSE`,
    },
  };
}, {});

export function parseOptions(options, config) {
  if (typeof config.modifier === 'function') {
    return config.modifier(options);
  }
  return options;
}

export const createCreators = (config, actionTypes, namespace, factory) =>
  Object.keys(config).reduce((acc, creatorName) => ({
    ...acc,
    [creatorName]: factory(config[creatorName], actionTypes[creatorName], namespace),
  }), {});

export const reduceActionTypes = actionTypes =>
  Object.keys(actionTypes).reduce((acc, key) => {
    const { uppercaseName, ...asyncTypes } = actionTypes[key];

    const action = {
      actionTypes: actionTypes
    };
    return {
      ...acc,
      [uppercaseName]: asyncTypes,
    };
  }, {});

export default {
  parseToUppercase,
  createTypes,
  parseOptions,
  createCreators,
  reduceActionTypes,
};
