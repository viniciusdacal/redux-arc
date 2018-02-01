export default function createCreators(config, actionTypes, factory) {
  return Object.keys(config).reduce((acc, creatorName) => ({
    ...acc,
    [creatorName]: factory(config[creatorName], actionTypes[creatorName]),
  }), {});
}
