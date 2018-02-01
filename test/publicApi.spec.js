import {
  createApiActions,
  createActions,
  createAsyncMiddleware,
  createReducers,
  mergeTypesAndCreators,
  middlewares,
} from '../src';

const publicNames = [
  'createApiActions',
  'createActions',
  'createAsyncMiddleware',
  'createReducers',
  'mergeTypesAndCreators',
  'middlewares',
]

describe('publicApi', () => {
  [
    createApiActions,
    createActions,
    createAsyncMiddleware,
    createReducers,
    mergeTypesAndCreators,
    middlewares,
  ].map((value, index) => {
    it(`should ${publicNames[index]} be present`, () => {
      expect(!!value).toBe(true)
    });
  });
});
