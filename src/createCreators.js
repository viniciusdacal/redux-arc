import fsaActionCreatorFactory from './fsaActionCreatorFactory';
import apiActionCreatorFactory from './apiActionCreatorFactory';

function getFactory(singleConfig) {
  return !singleConfig || !singleConfig.url
    ? fsaActionCreatorFactory
    : apiActionCreatorFactory;
}
const DEFAULT_CONFIG = {};

/*
  @param {Object} config - original config object provided to createApiActions
  @param {Object} actionTypes - action types object with keys being the original names and the value
  being the uppercased namespace + uppercased name.
*/
export default function createCreators(config, actionTypes) {
  return Object.keys(config).reduce((acc, creatorName) => {
    const singleConfig = config[creatorName] || DEFAULT_CONFIG;
    const factory = getFactory(singleConfig)

    return {
      ...acc,
      [creatorName]: factory(singleConfig, actionTypes[creatorName]),
    };
  }, {});
}
