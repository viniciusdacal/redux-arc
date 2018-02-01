import { parseToUppercase } from '../utils';

export default function validateConfig(namespace, configs) {
  configs.forEach((creatorNameOrConfig, index) => {
    if (typeof creatorNameOrConfig === 'string') {
      return;
    }

    const config = creatorNameOrConfig;
    const configName = `${namespace}_${parseToUppercase(creatorNameOrConfig.action)}`;

    if (!config.action) {
      throw new Error(
        `Invalid action name at index: ${index}. All config objects must contain a property [name]`
      );
    }

    if (config.modifier && typeof config.modifier !== 'function') {
      throw new Error(
        `Invalid modifier, ${config.modifier}, provided for ${configName}, it should be a function`,
      );
    }
  });

  if (!namespace || typeof namespace !== 'string') {
    throw new Error(`Invalid namespace provided: ${namespace}, it should be a string`);
  }
}
