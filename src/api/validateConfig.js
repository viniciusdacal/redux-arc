import { parseToUppercase } from '../utils';

export default function validateConfig(namespace, configs) {
  Object.keys(configs).forEach((creatorName) => {
    const config = configs[creatorName];
    const configName = `${namespace}_${parseToUppercase(creatorName)}`;

    if (typeof config.url !== 'string' && typeof config.url !== 'function') {
      throw new Error(
        `Invalid url, ${config.url}, provided for ${configName}, it should be a string or a function that returns a string`,
      );
    }
    if (typeof config.url === 'string' && /:payload*/g.test(config.url)) {
      throw new Error(
        `Invalid url, ${config.url}, provided for ${configName}, you cannot use payload as a param`,
      );
    }
    if (typeof config.method !== 'string' || !config.method.length) {
      throw new Error(
        `Invalid method,  ${config.method}, provided for ${configName}, it should be a string`,
      );
    }
    if (config.modifier && typeof config.modifier !== 'function') {
      throw new Error(
        `Invalid modifier handler, ${config.modifier}, provided for ${configName}, it should be a function`,
      );
    }
  });

  if (!namespace || typeof namespace !== 'string') {
    throw new Error(`Invalid namespace provided: ${namespace}, it should be a string`);
  }
}
