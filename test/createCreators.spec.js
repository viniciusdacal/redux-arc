import createCreators from '../src/createCreators';
import apiActionCreatorFactory from '../src/api/apiActionCreatorFactory';

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
    });

    expect(creators.listWithUrlFunction({ test: 1232 })).toEqual({
      type: [
        'MY_LIST_WITH_URL_FUNCTION_REQUEST',
        'MY_LIST_WITH_URL_FUNCTION_RESPONSE'
      ],
      meta: {
        url: urlFunction({ test: 1232 }),
        method: 'get',
        test: 1232,
      },
    });

    expect(creators.read({ id: '123' })).toEqual({
      type: ['MY_READ_REQUEST', 'MY_READ_RESPONSE'],
      meta: {
        url: 'endpoint/123',
        method: 'put',
        id: '123',
      },
    });

    expect(creators.readWithExtras({ id: '123' })).toEqual({
      type: ['MY_READ_WITH_EXTRAS_REQUEST', 'MY_READ_WITH_EXTRAS_RESPONSE'],
      meta: {
        url: 'endpoint/123',
        method: 'put',
        id: '123',
        middlewares: ['myMiddleware'],
      },
    });
  });
});
