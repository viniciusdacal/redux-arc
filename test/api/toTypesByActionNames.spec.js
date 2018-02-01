import toTypesByActionNames from '../../src/api/toTypesByActionNames';

describe('toTypesByActionNames', () => {
  const reducedTypes = toTypesByActionNames({
    list: 'MY_LIST',
    listWithUrlFunction: 'MY_LIST_WITH_URL_FUNCTION',
    read: 'MY_READ',
    readWithExtras: 'MY_READ_WITH_EXTRAS',
  });

  it('should return the types formatted in async types, to be used by reducers', () => {
    expect(reducedTypes).toEqual({
      LIST: {
        REQUEST: 'MY_LIST_REQUEST',
        RESPONSE: 'MY_LIST_RESPONSE',
      },
      LIST_WITH_URL_FUNCTION: {
        REQUEST: 'MY_LIST_WITH_URL_FUNCTION_REQUEST',
        RESPONSE: 'MY_LIST_WITH_URL_FUNCTION_RESPONSE',
      },
      READ: {
        REQUEST: 'MY_READ_REQUEST',
        RESPONSE: 'MY_READ_RESPONSE',
      },
      READ_WITH_EXTRAS: {
        REQUEST: 'MY_READ_WITH_EXTRAS_REQUEST',
        RESPONSE: 'MY_READ_WITH_EXTRAS_RESPONSE',
      },
    });
  })
});
