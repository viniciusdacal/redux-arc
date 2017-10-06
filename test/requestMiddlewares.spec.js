import {
  globalMiddlewares,
  register,
  reset,
  getRequestMiddlewares,
} from '../src/requestMiddlewares';

beforeEach(() => {
  reset();
});

describe('reset', () => {
  it('should reset the globalMiddlewares', () => {
    const police = store => done => (action, error, response) => done(action, error, response);
    police.applyPoint = 'beforeRequest';
    register('myMiddleware', police);

    expect(globalMiddlewares.myMiddleware).not.toBe(undefined);
    reset();
    expect(globalMiddlewares.myMiddleware).toBe(undefined);
  });
})

describe('register', () => {
  it('should register a police into global policies', () => {
    const police = store => done => (action, error, response) => done(action, error, response);
    police.applyPoint = 'beforeRequest';
    register('myMiddleware', police);

    expect(globalMiddlewares.myMiddleware).toBe(police);
  });

  it('should throw when try to register a police more than once', () => {
    const police = store => done => (action, error, response) => done(action, error, response);
    police.applyPoint = 'beforeRequest';
    register('myMiddleware', police);

    expect(() => register('myMiddleware', police)).toThrow();
  });

  it('should validate a police', () => {
    // police without applyPoint
    const police = store => done => (action, error, response) => done(action, error, response);
    expect(() => register('myMiddleware', police)).toThrow();
    reset();
    //invalid applyPoing
    police.applyPoint = 'beforeReques';
    expect(() => register('myMiddleware', police)).toThrow();
  });
});

describe('getRequestMiddlewares', () => {
  const SINGULAR_VALUE = 'SINGULAR_VALUE';
  test('should get the police runner for the given police array', (done) => {
    const police = store => next => (action, error, response) => {
      return next({ ...action, myMiddlewareWasHere: true }, error, response);
    };
    police.applyPoint = 'beforeRequest';
    register('myMiddleware', police);

    const myAction = { type: 'REQUEST' };
    const reqMiddlewares = getRequestMiddlewares(['myMiddleware']);
    const callback = (action) => {
      expect(action.myMiddlewareWasHere).toBe(true);

      done();
      return SINGULAR_VALUE;
    };
    const result = reqMiddlewares('beforeRequest')({})(callback)(myAction, null, null);
    expect(result).toBe(SINGULAR_VALUE);
  });

  test('should run even without policies registered', (done) => {
    const myAction = { type: 'REQUEST' }
    const reqMiddlewares = getRequestMiddlewares(undefined);
    const callback = (action) => {
      expect(action).toBe(myAction);
      done();
      return SINGULAR_VALUE;
    };
    const result = reqMiddlewares('beforeRequest')({})(callback)(myAction, null, null);
    expect(result).toBe(SINGULAR_VALUE);
  });

  test('Should throw when trying to use a non registered policy', () => {
    expect(
      () => getRequestMiddlewares(['nonRegisteredMiddleware'])
    ).toThrowError(
      'Middleware nonRegisteredMiddleware not registered. Perhaps you forgot to import its file'
    );
  });

  test('Should run the policies in the given order', (done) => {
    const appendB = store => next => (action, error, response) =>
      next({ ...action, payload: action.payload + 'B' }, error, response);

    appendB.applyPoint = 'beforeRequest';

    const appendC = store => next => (action, error, response) =>
      next({ ...action, payload: action.payload + 'C' }, error, response);
    appendC.applyPoint = 'beforeRequest';

    const appendD = store => next => (action, error, response) =>
      next({ ...action, payload: action.payload + 'D' }, error, response);

    appendD.applyPoint = 'beforeRequest';


    register('appendC', appendC);
    register('appendB', appendB);
    register('appendD', appendD);

    const myAction = { type: 'REQUEST', payload: 'A' };
    const runner = getRequestMiddlewares(['appendB', 'appendC', 'appendD']);
    const callback = (action) => {
      expect(action.payload).toBe('ABCD');

      done();
      return action.payload;
    };
    const result = runner('beforeRequest')({})(callback)(myAction, null, null);
    expect(result).toBe('ABCD');
  })
});






