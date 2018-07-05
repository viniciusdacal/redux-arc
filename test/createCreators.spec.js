import createCreators from '../src/createCreators';
import apiActionCreatorFactory from '../src/apiActionCreatorFactory';

const urlFunction = (params) => `/${params.test}/`;

const BASE_TYPES = {
  list: 'MY_LIST',
  listWithUrlFunction: 'MY_LIST_WITH_URL_FUNCTION',
  read: 'MY_READ',
  readWithExtras: 'MY_READ_WITH_EXTRAS',
};

const BASE_CONFIGS = {
  list: { url: 'endpoint', method: 'get' },
  listWithUrlFunction: { url: urlFunction, method: 'get' },
  read: { url: 'endpoint/:id', method: 'put' },
  readWithExtras: {
    url: 'endpoint/:id',
    method: 'put',
    middlewares: ['myMiddleware'],
  },
};


describe('createCreators', () => {
  it('should return an action creator', () => {
    const creators = createCreators(BASE_CONFIGS, BASE_TYPES, apiActionCreatorFactory);

    expect(creators.list()).toEqual({
      type: ['MY_LIST_REQUEST', 'MY_LIST_RESPONSE'],
      meta: {
        url: 'endpoint',
        method: 'get',
      },
      payload: undefined,
    });

    expect(creators.listWithUrlFunction(null, { test: 1232 })).toEqual({
      type: [
        'MY_LIST_WITH_URL_FUNCTION_REQUEST',
        'MY_LIST_WITH_URL_FUNCTION_RESPONSE'
      ],
      meta: {
        url: urlFunction({ test: 1232 }),
        method: 'get',
        test: 1232,
      },
      payload: null,
    });

    expect(creators.read(null, { id: '123' })).toEqual({
      type: ['MY_READ_REQUEST', 'MY_READ_RESPONSE'],
      meta: {
        url: 'endpoint/123',
        method: 'put',
        id: '123',
      },
      payload: null
    });

    expect(creators.readWithExtras(null, { id: '123' })).toEqual({
      type: ['MY_READ_WITH_EXTRAS_REQUEST', 'MY_READ_WITH_EXTRAS_RESPONSE'],
      meta: {
        url: 'endpoint/123',
        method: 'put',
        id: '123',
        middlewares: ['myMiddleware'],
      },
      payload: null,
    });
  });
});
