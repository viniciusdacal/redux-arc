import { getRequestMiddlewares } from '../src/requestMiddlewares';

describe('getRequestMiddlewares', () => {
  const SINGULAR_VALUE = 'SINGULAR_VALUE';
  test('should get the police runner for the given police array', (done) => {
    const myMiddleware = store => next => (action, error, response) => {
      return next({ ...action, myMiddlewareWasHere: true }, error, response);
    };
    myMiddleware.applyPoint = 'onRequest';

    const myAction = { type: 'REQUEST' };
    const reqMiddlewares = getRequestMiddlewares([myMiddleware]);
    const callback = (action) => {
      expect(action.myMiddlewareWasHere).toBe(true);

      done();
      return SINGULAR_VALUE;
    };
    const result = reqMiddlewares('onRequest')({})(callback)(myAction, null, null);
    expect(result).toBe(SINGULAR_VALUE);
  });

  test('should run even without middlewares registered', (done) => {
    const myAction = { type: 'REQUEST' }
    const reqMiddlewares = getRequestMiddlewares(undefined);
    const callback = (action) => {
      expect(action).toBe(myAction);
      done();
      return SINGULAR_VALUE;
    };
    const result = reqMiddlewares('onRequest')({})(callback)(myAction, null, null);
    expect(result).toBe(SINGULAR_VALUE);
  });

  test('Should throw when trying to use a invalid middleware', () => {
    const invalidMiddleware = {};

    expect(
      () => getRequestMiddlewares(['invalidMiddlewareString', invalidMiddleware])
    ).toThrowError(
      `All middlewares should be functions: [invalidMiddlewareString,[object Object]]`
    );
  });

  test('Should run the middlewares in the given order', (done) => {
    const appendB = store => next => (action, error, response) =>
      next({ ...action, payload: action.payload + 'B' }, error, response);

    appendB.applyPoint = 'onRequest';

    const appendC = store => next => (action, error, response) =>
      next({ ...action, payload: action.payload + 'C' }, error, response);
    appendC.applyPoint = 'onRequest';

    const appendD = store => next => (action, error, response) =>
      next({ ...action, payload: action.payload + 'D' }, error, response);

    appendD.applyPoint = 'onRequest';

    const myAction = { type: 'REQUEST', payload: 'A' };
    const runner = getRequestMiddlewares([appendB, appendC, appendD]);
    const callback = (action) => {
      expect(action.payload).toBe('ABCD');

      done();
      return action.payload;
    };
    const result = runner('onRequest')({})(callback)(myAction, null, null);
    expect(result).toBe('ABCD');
  })
});






