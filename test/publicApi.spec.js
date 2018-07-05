import {
  createActions,
  createAsyncMiddleware,
  createReducers,
  middlewares,
} from '../src';

const publicNames = [
  'createActions',
  'createAsyncMiddleware',
  'createReducers',
  'middlewares',
];

describe('publicApi', () => {
  [
    createActions,
    createAsyncMiddleware,
    createReducers,
    middlewares,
  ].map((value, index) => {
    it(`should ${publicNames[index]} be present`, () => {
      expect(!!value).toBe(true);
    });
  });
});
