import { toAsyncTypes } from './utils';
import parseUrl from './parseUrl';

const normalizeUrl = (url, params) => typeof url === 'function' ? url(params) : url;

export default function apiActionCreatorFactory(config, type) {
  const { payload: configPayload, url: configUrl, meta: configMeta, ...restMeta } = config;
  const asyncTypes = toAsyncTypes(type);

  function apiActionCreator(payload, meta) {
    const url = normalizeUrl(configUrl, meta);

    const finalMeta = {
      ...(configMeta || {}),
      ...(meta || {}),
      ...restMeta,
    };

    return {
      type: asyncTypes,
      payload: payload !== undefined ? payload : configPayload,
      meta: {
        ...finalMeta,
        url: parseUrl(url, finalMeta),
      },
    };
  }

  Object.assign(apiActionCreator, config);

  return apiActionCreator;
}
