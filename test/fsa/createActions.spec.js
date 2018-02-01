import createActions from '../../src/fsa/createActions';

const baseConfigs = [
  'reset',
  'clear',
  {
    action: 'resetWithMeta',
    a: 'TEST',
    b: 'META_DATA',
    payload: 'TEST_PAYLOAD',
  },
];

describe('createActions', () => {
  const { types, creators } = createActions('my', baseConfigs);

  it('should return the proper types object', () => {
    const expectedTypes = {
      RESET: 'MY_RESET',
      CLEAR: 'MY_CLEAR',
      RESET_WITH_META: 'MY_RESET_WITH_META',
    };

    expect(types).toEqual(expectedTypes);
  });

  it('should return the proper action when calling a creator without any value', () => {
    expect(creators.reset()).toEqual({
      type: types.RESET,
    });
  });

  it('should insert meta and payload', () => {
    expect(creators.clear({ payload: 'TEST_PAYLOAD', id: '123' })).toEqual({
      type: types.CLEAR,
      payload: 'TEST_PAYLOAD',
      meta: {
        id: '123',
      },
    });
  });

  it('should insert meta and payload from config', () => {
    expect(creators.resetWithMeta()).toEqual({
      type: types.RESET_WITH_META,
      payload: 'TEST_PAYLOAD',
      meta: {
        a: 'TEST',
        b: 'META_DATA',
      },
    });
  });

  it('should use params from function call over same params from config', () => {
    expect(creators.resetWithMeta({ payload: 'NEW_PAYLOAD', a: 'B'})).toEqual({
      type: types.RESET_WITH_META,
      payload: 'NEW_PAYLOAD',
      meta: {
        a: 'B',
        b: 'META_DATA',
      },
    });
  });
});
