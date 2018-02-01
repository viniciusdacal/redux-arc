import createApiActions from '../../src/api/createApiActions';

const baseConfigs = {
  list: { url: 'endpoint', method: 'get' },
  read: { url: 'endpoint/:id', method: 'put' },
  readWithExtras: {
    url: 'endpoint/:id',
    method: 'put',
    middlewares: ['middleware'],
    extraParam: 'EXTRA_PARAM',
  },
};

describe('createApiActions', () => {
  const { types, creators } = createApiActions('my', baseConfigs);

  it('should return the proper types object', () => {
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
  });

  it('should return the proper action when calling a creator without any value', () => {
    expect(creators.list()).toEqual({
      type: [types.LIST.REQUEST, types.LIST.RESPONSE],
      meta: {
        url: 'endpoint',
        method: 'get',
      },
    });
  });

  it('should parse the url with provided params', () => {
    expect(creators.read({ id: '123' })).toEqual({
      type: [types.READ.REQUEST, types.READ.RESPONSE],
      meta: {
        url: 'endpoint/123',
        method: 'put',
        id: '123',
      },
    });
  });

  it('should return middlewares and any extra param inside meta', () => {
    expect(creators.readWithExtras({ id: '123', payload: { test: 'TEST' } })).toEqual({
      type: [types.READ_WITH_EXTRAS.REQUEST, types.READ_WITH_EXTRAS.RESPONSE],
      payload: { test: 'TEST' },
      meta: {
        url: 'endpoint/123',
        method: 'put',
        id: '123',
        middlewares: ['middleware'],
        extraParam: 'EXTRA_PARAM',
      },
    });
  })
});
