import {
  createApiActions,
  createActions,
  createAsyncMiddleware,
  createReducers,
  middlewares,
} from '../src';

const publicNames = [
  'createApiActions',
  'createActions',
  'createAsyncMiddleware',
  'createReducers',
  'middlewares',
]

describe('publicApi', () => {
  [
    createApiActions,
    createActions,
    createAsyncMiddleware,
    createReducers,
    middlewares,
  ].map((value, index) => {
    it(`should ${publicNames[index]} be present`, () => {
      expect(!!value).toBe(true)
    });
  });
});
