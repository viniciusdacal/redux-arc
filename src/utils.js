export const isString = str => typeof str === 'string';
export const checkAction = type => type.length === 2 && type.every(isString);
export const parseToUppercase = (str) => str.replace(/([A-Z])/g, '_$1').toUpperCase();

export const removeNamespace = (str, NAMESPACE) => str.replace(`${NAMESPACE}_`, '');

export const toAsyncTypes = (type) => [`${type}_REQUEST`, `${type}_RESPONSE`];

export function mergeTypesAndCreators(...typesAndCreators) {
  return typesAndCreators.reduce((acc, next, index) => {
    if (!next.types || !next.creators) {
      throw new Error(
        `argument of index: ${index} is an invalid argument.
         mergeTypesAndCreators is expecting all arguments to be objects with types and creators`
      );
    }
    return {
      types: { ...acc.types, ...next.types },
      creators: { ...acc.creators, ...next.creators },
    };
  }, { types: {}, creators: {} })
};
