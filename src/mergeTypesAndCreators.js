/*
 After using creators to generate types and creators of different types (Api, Fsa), you may would
 like to merge them together, in order to have only one object types and only one object creators
*/

export default function mergeTypesAndCreators(...typesAndCreators) {
  return typesAndCreators.reduce((acc, next, index) => {
    if (!next.types || !next.creators) {
      throw new Error(
        `argument of index: ${index} is invalid.
         mergeTypesAndCreators is expecting all arguments to be objects with types and creators`
      );
    }
    return {
      types: { ...acc.types, ...next.types },
      creators: { ...acc.creators, ...next.creators },
    };
  }, { types: {}, creators: {} })
};
