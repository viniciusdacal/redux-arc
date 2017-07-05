// eslint-disable import-first
jest.mock('../src/polices');

import { createStore, applyMiddleware } from 'redux';
import createAsyncMiddleware from '../src/middleware';
import policesMock from '../src/polices';

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
  it('should throw if you dont provide an asyncTask function', () => {
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

  it('should get actionPolices passing the proper argument', () => {
    const nextMock = jest.fn();
    const apiMiddleware = createAsyncMiddleware(asyncTask)(storeApi)(nextMock);
    const polices = ['mypolice'];
    apiMiddleware({
      type: ['REQUEST_ACTION', 'RESPONSE_ACTION'],
      meta: {
        polices,
      },
    });
    expect(policesMock.getActionPolices.mock.calls.length).toBe(1);
    expect(policesMock.getActionPolices.mock.calls[0][0]).toBe(polices);
    policesMock.getActionPolices.mockClear();
    policesMock.onCallApply.mockClear();
    storeApi.dispatch.mockClear();
  });

  it('should execute the polices in the sequence', () => {
    const nextMock = jest.fn();
    const apiMiddleware = createAsyncMiddleware(asyncTask)(storeApi)(nextMock);
    const polices = ['mypolice'];
    const returnValue = apiMiddleware({
      type: ['REQUEST_ACTION', 'RESPONSE_ACTION'],
      meta: {
        polices,
      },
    });

    expect(returnValue).toBe(API_RESPONSE);
    expect(policesMock.onCallApply.mock.calls.length).toBe(2);
    expect(policesMock.onCallApply.mock.calls[0][0]).toBe('beforeRequest');
    expect(policesMock.onCallApply.mock.calls[1][0]).toBe('onResponse');
    storeApi.dispatch.mockClear();
  });

  it('should dispatch an action with error when get error from the asyncTask', () => {
    const nextMock = jest.fn();
    const apiMiddleware = createAsyncMiddleware(asyncErrorTask)(storeApi)(nextMock);
    const polices = ['mypolice'];
    const returnValue = apiMiddleware({
      type: ['REQUEST_ACTION', 'RESPONSE_ACTION'],
      meta: {
        polices,
      },
    });

    expect(returnValue).toBe(API_ERROR);
    expect(storeApi.dispatch.mock.calls.length).toBe(2);
    expect(storeApi.dispatch.mock.calls[0][0].type).toBe('REQUEST_ACTION');
    expect(storeApi.dispatch.mock.calls[1][0].type).toBe('RESPONSE_ACTION');
    expect(storeApi.dispatch.mock.calls[1][0].error).toBe(true);
  });
});
