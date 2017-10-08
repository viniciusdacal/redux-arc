import {
  createApiActions,
  parseUrl,
  validateConfig,
} from '../src/apiActionCreator';

const baseConfigs = {
  list: { url: 'endpoint', method: 'get' },
  read: { url: 'endpoint/:id', method: 'put' },
  readWithExtras: { url: 'endpoint/:id', method: 'put', middlewares: ['middleware'], meta: {} },
};

describe('parseUrl', () => {
  it('should parseUrl', () => {
    expect(parseUrl('endpoint', null)).toBe('endpoint');
    expect(parseUrl('endpoint/:id', { id: '123' })).toBe('endpoint/123');
    expect(parseUrl('endpoint/:id', { id: 123 })).toBe('endpoint/123');
    expect(parseUrl('endpoint/:id/:otherId', { id: 123, otherId: 456 })).toBe('endpoint/123/456');
  });

  it('should throw when it has an invalid parameter', () => {
    expect(() => parseUrl('endpoint/:id', { id: {} })).toThrowError(
      'Param id from url endpoint/:id, not found in params object'
    );
  });
});

describe('validateConfig', () => {
  it('throws when not provide an url', () => {
    expect(() => validateConfig('my', { list: { method: 'get' } })).toThrow();
  });

  it('throws when provide payload as a url param', () => {
    expect(() => validateConfig('my', { list: { url: 'path/:payload', method: 'get' } })).toThrow();
  });

  it('throws when not provide a method', () => {
    expect(() => validateConfig('my', { list: { url: 'path/:id' } })).toThrow();
  });

  it('throws when modifier is not a function', () => {
    expect(() =>
      validateConfig('my', { list: { url: 'path/:id', method: 'save', modifier: {} } })
    ).toThrow();
  });

  it('throws when namespace is not a string', () => {
    expect(() =>
      validateConfig(1, {
        list: { url: 'path/:id', method: 'save', modifier: '' }
      })
    ).toThrow();
  });

  it('should not throw when provide a valid config', () => {
    expect(() =>
      validateConfig('my', { list: { url: 'path/:id', method: 'save', modifier: () => {} } })
    ).not.toThrow();
  });
});

describe('createApiActions', () => {
  const { types, creators } = createApiActions('my', baseConfigs);
  const expectedTypes = {
    LIST: {
      REQUEST: 'MY_LIST_REQUEST',
      RESPONSE: 'MY_LIST_RESPONSE',
    },
    READ: {
      REQUEST: 'MY_READ_REQUEST',
      RESPONSE: 'MY_READ_RESPONSE',
    },
    READ_WITH_EXTRAS: {
      REQUEST: 'MY_READ_WITH_EXTRAS_REQUEST',
      RESPONSE: 'MY_READ_WITH_EXTRAS_RESPONSE',
    },
  };
  expect(types).toEqual(expectedTypes);

  expect(creators.list()).toEqual({
    type: [types.LIST.REQUEST, types.LIST.RESPONSE],
    meta: {
      url: 'endpoint',
      method: 'get',
    },
  });

  expect(creators.read({ id: '123' })).toEqual({
    type: [types.READ.REQUEST, types.READ.RESPONSE],
    meta: {
      url: 'endpoint/123',
      method: 'put',
      id: '123',
    },
  });

  expect(creators.readWithExtras({ id: '123', payload: { test: 'TEST' } })).toEqual({
    type: [types.READ_WITH_EXTRAS.REQUEST, types.READ_WITH_EXTRAS.RESPONSE],
    payload: { test: 'TEST' },
    meta: {
      url: 'endpoint/123',
      method: 'put',
      id: '123',
      middlewares: ['middleware'],
    },
  });
});
