import toExternalTypes from '../src/toExternalTypes';

const baseConfig = {
  list: { url: 'test' },
  listWithUrlFunction: { url: 'test' },
  read: { url: 'test' },
  readWithExtras: { url: 'test' },
  fsaAction: null,
  secondFsaAction: {},
}

describe('toExternalTypes', () => {
  const reducedTypes = toExternalTypes(baseConfig, {
    list: 'MY_LIST',
    listWithUrlFunction: 'MY_LIST_WITH_URL_FUNCTION',
    read: 'MY_READ',
    readWithExtras: 'MY_READ_WITH_EXTRAS',
    fsaAction: 'MY_FSA_ACTION',
    secondFsaAction: 'MY_SECOND_FSA_ACTION',
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
      FSA_ACTION: 'MY_FSA_ACTION',
      SECOND_FSA_ACTION: 'MY_SECOND_FSA_ACTION',
    });
  })
});
