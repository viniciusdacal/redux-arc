import createReducers from '../src/createReducers';

describe('createReducers', () => {
  const INCLUDE_C = 'INCLUDE_C';
  const INCLUDE_D = 'INCLUDE_D';
  const ACTION_NOT_REGISTERED = 'ACTION_NOT_REGISTERED';
  const INITIAL_STATE = {
    a: 'A',
    b: 'B',
  };

  const HANDLERS = {
    [INCLUDE_C]: (state = INITIAL_STATE, action) => ({
      ...state,
      c: 'C',
    }),
    [INCLUDE_D]: (state = INITIAL_STATE, action) => ({
      ...state,
      d: 'D',
    }),
  };

  it('should throw when a key is not defined', () => {
    expect(() => {
      const key = undefined;
      createReducers({}, {
        a: 'test',
        [key]: function Test() {},
      })
    }).toThrow();
  });

  it('should throw when a reducer is not a function', () => {
    expect(() => {
      createReducers({}, { a: '' });
    }).toThrow();
  });

  const reducer = createReducers(INITIAL_STATE, HANDLERS);

  it('should return same state when no reducers found for the action', () => {
    expect(reducer(INITIAL_STATE, { type: ACTION_NOT_REGISTERED })).toEqual(INITIAL_STATE);
  })

  it('should provide the correct state', () => {
    expect(reducer({ z: 'z', y: 'y'}, { type: ACTION_NOT_REGISTERED })).toEqual({ z: 'z', y: 'y'});
  });

  it('should call only the reducer registered for the action', () => {
    expect(reducer(INITIAL_STATE, { type: INCLUDE_C })).toEqual({
      a: 'A',
      b: 'B',
      c: 'C',
    });

    expect(reducer(INITIAL_STATE, { type: INCLUDE_D })).toEqual({
      a: 'A',
      b: 'B',
      d: 'D',
    });
  });

});
