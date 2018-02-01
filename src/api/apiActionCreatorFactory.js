import { toAsyncTypes } from '../utils';
import parseOptions from '../parseOptions';
import parseUrl from './parseUrl';

const normalizeUrl = (url, params) => typeof url === 'function' ? url(params) : url;

export default function apiActionCreatorFactory(config, type) {
  const { modifier, payload: configPayload, url: configUrl, meta, ...configMeta } = config;
  const asyncTypes = toAsyncTypes(type);

  function apiActionCreator(options) {
    const { payload, ...params } = parseOptions(options, config.modifier);
    const url = normalizeUrl(configUrl, params);

    return {
      type: asyncTypes,
      payload: payload !== undefined ? payload : configPayload,
      meta: {
        ...meta,
        ...configMeta,
        ...params,
        url: parseUrl(url, params),
      },
    };
  }

  Object.assign(apiActionCreator, config);

  Object.defineProperty(
    apiActionCreator,
    'name',
    {
      value: `${type} apiActionCreator`,
      writable: false
    },
  );

  return apiActionCreator;
}
