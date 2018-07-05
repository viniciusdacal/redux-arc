const urlFunction = (params) => `/${params.test}/`;

export const BASE_TYPES = {
  list: 'MY_LIST',
  listWithUrlFunction: 'MY_LIST_WITH_URL_FUNCTION',
  read: 'MY_READ',
  readWithExtras: 'MY_READ_WITH_EXTRAS',
};

export const BASE_CONFIGS = {
  list: { url: 'endpoint', method: 'get' },
  listWithUrlFunction: { url: urlFunction, method: 'get' },
  read: { url: 'endpoint/:id', method: 'put' },
  readWithExtras: {
    url: 'endpoint/:id',
    method: 'put',
    middlewares: ['myMiddleware'],
  },
};
