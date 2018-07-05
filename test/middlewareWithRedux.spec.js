import { createStore, applyMiddleware } from 'redux';
import createAsyncMiddleware from '../src/createAsyncMiddleware';


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
      meta: { url: 'test' },
      payload: {},
    });

    expect(mockReducer.mock.calls[1][1]).toEqual({
      type: 'RESPONSE_ACTION',
      meta: { url: 'test' },
      payload: SINGULAR_RESPONSE,
    });

    returnedValue.then((value) => {
      done();
      expect(value).toBe(SINGULAR_RESPONSE);
    })
  });

  it('should perform middlewares over the actions', (done) => {
    mockReducer.mockClear();

    const onRequestMiddleware = store => done => (action, error, response) =>
      done({
        ...action,
        meta: { ...action.meta, onRequest: true },
      }, error, response);

    onRequestMiddleware.applyPoint = 'onRequest';

    const onResponseMiddleware = store => done => (action, error, response) =>
      done({
        ...action,
        meta: { ...action.meta, onResponse: true },
      }, error, response);

    onResponseMiddleware.applyPoint = 'onResponse';

    const returnedValue = store.dispatch({
      type: ['REQUEST_ACTION', 'RESPONSE_ACTION'],
      payload: {},
      meta: {
        url: 'test',
        middlewares: [onRequestMiddleware, onResponseMiddleware],
        extras: true
      },
    });

    expect(mockReducer.mock.calls[0][1]).toEqual({
      type: 'REQUEST_ACTION',
      payload: {},
      meta: {
        url: 'test',
        middlewares: [onRequestMiddleware, onResponseMiddleware],
        extras: true,
        onRequest: true,
      },
    });

    expect(mockReducer.mock.calls[1][1]).toEqual({
      type: 'RESPONSE_ACTION',
      meta: {
        url: 'test',
        middlewares: [onRequestMiddleware, onResponseMiddleware],
        extras: true, onResponse: true, onRequest: true,
      }, // Passed through both middlewares
      payload: SINGULAR_RESPONSE,
    });

    returnedValue.then((value) => {
      done();
      expect(value).toBe(SINGULAR_RESPONSE);
    });
  });
});
