import mergeTypesAndCreators from '../src/mergeTypesAndCreators';

function read() {}
function list() {}
function resetForm() {}
function clear() {}

describe('mergeTypesAndCreators', () => {
  const apiTypesAndCreators = {
    types: {
      READ: {
        REQUEST: 'MY_READ_REQUEST',
        RESPONSE: 'MY_READ_RESPONSE',
      },
      LIST: {
        REQUEST: 'MY_LIST_REQUEST',
        RESPONSE: 'MY_LIST_RESPONSE',
      }
    },
    creators: {
      read,
      list,
    },
  };

  const fsaTypesAndCreators = {
    types: {
      RESET_FORM: 'MY_RESET_FORM',
      CLEAR: 'MY_CLEAR',
    },
    creators: {
      resetForm,
      clear,
    },
  }

  it('should return a new object with creators and types', () => {
    expect(mergeTypesAndCreators(apiTypesAndCreators)).toEqual(apiTypesAndCreators);
  });

  it('should merge different creators and types into single ones', () => {
    expect(mergeTypesAndCreators(apiTypesAndCreators, fsaTypesAndCreators)).toEqual({
      types: {
        READ: {
          REQUEST: 'MY_READ_REQUEST',
          RESPONSE: 'MY_READ_RESPONSE',
        },
        LIST: {
          REQUEST: 'MY_LIST_REQUEST',
          RESPONSE: 'MY_LIST_RESPONSE',
        },
        RESET_FORM: 'MY_RESET_FORM',
        CLEAR: 'MY_CLEAR',
      },
      creators: {
        read,
        list,
        resetForm,
        clear,
      }
    });
  });
});
