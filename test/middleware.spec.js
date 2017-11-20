/* eslint-disable import/first */
jest.mock('../src/requestMiddlewares', () => ({
  globalMiddlewares: {},
  onCallApply: jest.fn((applyPoint) => store => done =>
  (action, error, response) => done(action, error, response))
}));
const middlewares = require('../src/requestMiddlewares');
const get = policeNames => middlewares.onCallApply;
middlewares.getRequestMiddlewares = jest.fn((middlewares) => {
  if (Array.isArray(middlewares)) {
    return get(middlewares);
  }
  return get([]);
});


// eslint-disable-next-line import/first
import { createAsyncMiddleware } from '../src/middleware';
import middlewaresMock from '../src/requestMiddlewares';

const storeApi = {
  dispatch: jest.fn(() => {}),
  getState: jest.fn(() => {}),
};

const API_RESPONSE = 'API_RESPONSE';
const API_ERROR = 'API_ERROR';

const asyncTask = store => done => (action) => {
  done(null, API_RESPONSE);
  return API_RESPONSE;
};

const asyncErrorTask = store => done => (action) => {
  done(API_ERROR, null);
  return API_ERROR;
};

describe('createAsyncMiddleware', () => {
  it('should throw if you does not provide an asyncTask function', () => {
    expect(() => createAsyncMiddleware()).toThrow()
    expect(() => createAsyncMiddleware('test')).toThrow();
  });

  it('should not intercept regular actions', () => {
    const nextMock = jest.fn();
    const apiMiddleware = createAsyncMiddleware(asyncTask)(storeApi)(nextMock);

    apiMiddleware({ type: 'REGULAR_ACTION', meta: {} });
    expect(nextMock.mock.calls.length).toBe(1);
  });

  it('should throw for invalid types', () => {
    const nextMock = jest.fn();
    const apiMiddleware = createAsyncMiddleware(asyncTask)(storeApi)(nextMock);

    expect(() => apiMiddleware({ type: ['REGULAR_ACTION', 2], meta: {} })).toThrow();
  });

  it('should throw when has no meta in the action', () => {
    const nextMock = jest.fn();
    const apiMiddleware = createAsyncMiddleware(asyncTask)(storeApi)(nextMock);

    expect(() => apiMiddleware({ type: ['REGULAR_ACTION', '2'] })).toThrow();
  });

  it('should get actionPolicies passing the proper argument', () => {
    const nextMock = jest.fn();
    const apiMiddleware = createAsyncMiddleware(asyncTask)(storeApi)(nextMock);
    const middlewares = ['mypolice'];
    apiMiddleware({
      type: ['REQUEST_ACTION', 'RESPONSE_ACTION'],
      meta: {
        middlewares,
      },
    });
    expect(middlewaresMock.getRequestMiddlewares.mock.calls.length).toBe(1);
    expect(middlewaresMock.getRequestMiddlewares.mock.calls[0][0]).toBe(middlewares);
    middlewaresMock.getRequestMiddlewares.mockClear();
    middlewaresMock.onCallApply.mockClear();
    storeApi.dispatch.mockClear();
  });

  it('should execute the middlewares in the sequence', () => {
    const nextMock = jest.fn();
    const apiMiddleware = createAsyncMiddleware(asyncTask)(storeApi)(nextMock);
    const middlewares = ['mypolice'];
    const returnValue = apiMiddleware({
      type: ['REQUEST_ACTION', 'RESPONSE_ACTION'],
      meta: {
        middlewares,
      },
    });

    expect(returnValue).toBe(API_RESPONSE);
    expect(middlewaresMock.onCallApply.mock.calls.length).toBe(2);
    expect(middlewaresMock.onCallApply.mock.calls[0][0]).toBe('onRequest');
    expect(middlewaresMock.onCallApply.mock.calls[1][0]).toBe('onResponse');
    storeApi.dispatch.mockClear();
  });

  it('should dispatch an action with error when get error from the asyncTask', () => {
    const nextMock = jest.fn();
    const apiMiddleware = createAsyncMiddleware(asyncErrorTask)(storeApi)(nextMock);
    const middlewares = ['mypolice'];
    const returnValue = apiMiddleware({
      type: ['REQUEST_ACTION', 'RESPONSE_ACTION'],
      meta: {
        middlewares,
      },
    });

    expect(returnValue).toBe(API_ERROR);
    expect(storeApi.dispatch.mock.calls.length).toBe(2);
    expect(storeApi.dispatch.mock.calls[0][0].type).toBe('REQUEST_ACTION');
    expect(storeApi.dispatch.mock.calls[1][0].type).toBe('RESPONSE_ACTION');
    expect(storeApi.dispatch.mock.calls[1][0].error).toBe(true);
    expect(storeApi.dispatch.mock.calls[1][0].payload).toBe(API_ERROR);
  });

  it('should call asyncTask with the store', () => {
    const asyncTaskMock = jest.fn();
    asyncTaskMock.mockReturnValue(() => () => {});
    const apiMiddleware = createAsyncMiddleware(asyncTaskMock)(storeApi)(() => {});
    apiMiddleware({
      type: ['REQUEST_ACTION', 'RESPONSE_ACTION'],
      meta: {},
    });

    expect(asyncTaskMock.mock.calls[0][0]).toBe(storeApi);
    storeApi.dispatch.mockClear();
  })
});
