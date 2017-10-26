import {
  reduceActionTypes,
  parseToUppercase,
  createTypes,
  createCreators,
  parseOptions,
} from './asyncActionHelpers';

export function apiActionCreatorFactory(config, types, namespace) {
  function apiCreator(options) {
    const { payload, ...params } = parseOptions(options, config) || {};
    const url = typeof config.url === 'function'
      ? config.url(params)
      : config.url;

    const action = {
      type: [types.REQUEST, types.RESPONSE],
      meta: {
        ...params,
        url: parseUrl(url, params),
        method: config.method,
      },
    };

    if (payload) {
      action.payload = payload;
    }

    if (config.meta) {
      action.meta = { ...config.meta, ...action.meta };
    }

    if (config.middlewares) {
      action.meta.middlewares = config.middlewares;
    }

    return action;
  }

  Object.defineProperty(
    apiCreator,
    'name',
    {
      value: `${namespace}_${types.uppercaseName} apiCreator`,
      writable: false
    },
  );

  return apiCreator;
}

export function parseUrl(url, params) {
  return url.replace(/(:)([A-Za-z0-9]*)/g, (match, $1, $2) => {
    const paramType  = typeof params[$2];
    if (paramType !== 'string' && paramType !== 'number') {
      throw new Error(`Param ${$2} from url ${url}, not found in params object`);
    }
    return params[$2];
  });
}

export function validateConfig(namespace, configs) {
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

export function createApiActions(namespace, config, options) {
  const upNamespace = parseToUppercase(namespace);
  validateConfig(upNamespace, config);
  const actionKeys = Object.keys(config);
  const actionTypes = createTypes(actionKeys, upNamespace);
  const creators = createCreators(config, actionTypes, upNamespace, apiActionCreatorFactory);

  return {
    creators,
    types: reduceActionTypes(actionTypes),
  };
}

export default {
  createApiActions,
  apiActionCreatorFactory,
  parseUrl,
  validateConfig,
};
