import { createStore, applyMiddleware } from 'redux';
import polices from '../src/polices';
import { createAsyncMiddleware } from '../src/middleware';


describe('Testing middleware on redux', () => {
  const SINGULAR_RESPONSE = 'SINGULAR_RESPONSE';
  const asyncTask = store => next => (action) => {
    next(null, SINGULAR_RESPONSE);

    const promise = new Promise((resolve, reject) => {
      resolve(SINGULAR_RESPONSE);
    });

    return promise;
  };

  const mockReducer = jest.fn((state, action) => state);
  const createStoreWithHamal = applyMiddleware(createAsyncMiddleware(asyncTask))(createStore);
  const store = createStoreWithHamal(mockReducer);

  it('should dispatch the actions', (done) => {
    mockReducer.mockClear();
    const returnedValue = store.dispatch({
      type: ['REQUEST_ACTION', 'RESPONSE_ACTION'],
      meta: { url: 'test' },
      payload: {},
    });

    expect(mockReducer.mock.calls[0][1]).toEqual({
      type: 'REQUEST_ACTION',
      meta: {},
    });

    expect(mockReducer.mock.calls[1][1]).toEqual({
      type: 'RESPONSE_ACTION',
      meta: {},
      payload: SINGULAR_RESPONSE,
    });

    returnedValue.then((value) => {
      done();
      expect(value).toBe(SINGULAR_RESPONSE);
    })
  });

  it('should perform polices over the actions', (done) => {
    mockReducer.mockClear();

    const beforeRequestPolice = store => done => (action, error, response) =>
      done({
        ...action,
        meta: { ...action.meta, onRequest: true },
      }, error, response);

    beforeRequestPolice.applyPoint = 'beforeRequest';

    const onResponsePolice = store => done => (action, error, response) =>
      done({
        ...action,
        meta: { ...action.meta, onResponse: true },
      }, error, response);

    onResponsePolice.applyPoint = 'onResponse';

    polices.register('beforeRequestPolice', beforeRequestPolice)
    polices.register('onResponsePolice', onResponsePolice)

    const returnedValue = store.dispatch({
      type: ['REQUEST_ACTION', 'RESPONSE_ACTION'],
      payload: {},
      meta: { url: 'test', polices: ['beforeRequestPolice', 'onResponsePolice'], extras: true },
    });

    expect(mockReducer.mock.calls[0][1]).toEqual({
      type: 'REQUEST_ACTION',
      meta: { extras: true, onRequest: true },
    });

    expect(mockReducer.mock.calls[1][1]).toEqual({
      type: 'RESPONSE_ACTION',
      meta: { extras: true, onResponse: true, onRequest: true }, // Passed through both polices
      payload: SINGULAR_RESPONSE,
    });

    returnedValue.then((value) => {
      done();
      expect(value).toBe(SINGULAR_RESPONSE);
    })
  });
});
